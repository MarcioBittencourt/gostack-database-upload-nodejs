import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }

    const transactionsBalance = getCustomRepository(TransactionsRepository);

    const balance = await transactionsBalance.getBalance();

    if (type === 'outcome' && value > (await balance).total) {
      throw new AppError('you do not have enough balance');
    }
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
