import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginatedResponse } from '@los-scf/types';

export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  page: number,
  limit: number,
): Promise<PaginatedResponse<T>> {
  const [data, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LOS${year}${month}${random}`;
}

export function generateLoanAccountNumber(): string {
  const prefix = 'LAC';
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${random}`;
}

export function paiseToCurrency(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(rupees);
}
