import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionDelete = await transactionsRepository.findOne(id);

    if (!transactionDelete) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.remove(transactionDelete);
  }
}

export default DeleteTransactionService;
