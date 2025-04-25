# Private Delegate Statements

Allows DAO delegates to make private statements without revealing their identity.

## How it works

1. Delegates join anonymity pools onchain (default pools are 1k, 10k, and 50k voting power).
2. Any delegate from within a pool can make a statement without revealing exactly which member they are.
3. Viewers can verify that the statement came from a delegate in the pool using ZK proofs powered by [Semaphore](https://semaphore.pse.dev/).

