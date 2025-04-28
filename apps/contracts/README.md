# Contracts

Smart contract that regulates access to anonymity pools of DAO delegates.

## Deployments

| Contract          | Address                                    |
| ----------------- | ------------------------------------------ |
| Semaphore.sol     | 0x4ca12bd748f8567c92ed65ea46b8913d038f99f2 |
| DelegatePools.sol | 0x0000000000572fA1d5fc39988eD0785AF08B0d99 |

## Local Development

From the parent monorepo directory, install dependencies.

```bash
pnpm install
```

Navigate to the contracts directory and create a `.env` file. You don't have to change any of the values for testing purposes.

```bash
cd apps/contracts
cp .env.example .env
```

Compile contracts and run the tests.

```bash
pnpm test
```
