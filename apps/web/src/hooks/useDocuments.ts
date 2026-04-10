import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { DocumentType } from '@los-scf/types';

export function useDocuments(leadId: string) {
  return useQuery({
    queryKey: ['documents', leadId],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${leadId}/documents`);
      return data;
    },
    enabled: !!leadId,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadId,
      file,
      documentType,
    }: {
      leadId: string;
      file: File;
      documentType: DocumentType;
    }) => {
      const { data: urlData } = await api.post(`/leads/${leadId}/documents/upload-url`, {
        documentType,
        fileName: file.name,
        contentType: file.type,
      });

      await fetch(urlData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      const { data: doc } = await api.post(`/leads/${leadId}/documents/register`, {
        documentType,
        s3Key: urlData.s3Key,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      return doc;
    },
    onSuccess: (_, { leadId }) => {
      qc.invalidateQueries({ queryKey: ['documents', leadId] });
    },
  });
}
