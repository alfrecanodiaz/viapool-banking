import { INestApplication } from "@nestjs/common";
import { TransactionCommitDTO } from "./dto/transactions.dto";
import { TransactionType } from "./transactions.types";
import { ViapoolTestModule } from "../utils/main.test.module";
import supertest = require("supertest");

jest.setTimeout(50000);

let app: INestApplication;

const transactionCreditPayload: TransactionCommitDTO = {
  type: TransactionType.CREDIT,
  amount: 10000,
}

const transactionDebitPayload: TransactionCommitDTO = {
  type: TransactionType.DEBIT,
  amount: 5000,
}

const transactionDebitOverloadPayload: TransactionCommitDTO = {
  type: TransactionType.DEBIT,
  amount: 50000,
}

beforeAll(async (done) => {
  const testingModule = new ViapoolTestModule();
  await testingModule.moduleRefInit();
  app = await testingModule.initialize();
  done();
});

describe('Test for transactions scenarios', () => {
  it('Transactions - should commit a new transaction of type credit succesfully', async (done) => {
    expect(app).toBeDefined();

    await supertest(app.getHttpServer())
      .post("/banking/transactions")
      .send(transactionCreditPayload)
      .expect(201);

    done();
  });

  it('Accounts - should return the balance in relation to the credit transaction', async (done) => {
    expect(app).toBeDefined();

    await supertest(app.getHttpServer())
      .get("/banking/accounts/balance")
      .expect(200, { balance: 10000 });

    done();
  });

  it('Transactions - should commit a new transaction of type debit succesfully', async (done) => {
    expect(app).toBeDefined();

    await supertest(app.getHttpServer())
      .post("/banking/transactions")
      .send(transactionDebitPayload)
      .expect(201);

    done();
  });

  it('Accounts - should return the balance in relation to the credit transaction', async (done) => {
    expect(app).toBeDefined();

    await supertest(app.getHttpServer())
      .get("/banking/accounts/balance")
      .expect(200, { balance: 5000 });

    done();
  });

  it('Transactions - should reject the transaction due to insufficient funds', async (done) => {
    expect(app).toBeDefined();

    await supertest(app.getHttpServer())
      .post("/banking/transactions")
      .send(transactionDebitOverloadPayload)
      .expect(400);

    done();
  });
});

afterAll(async (done) => {
  await app.close();
  done();
});
