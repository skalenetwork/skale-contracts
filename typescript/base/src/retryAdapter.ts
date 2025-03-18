import { Abi, ContractAddress } from "./domain/types";
import { Adapter, ContractData, FunctionCall } from "./adapter";

const defaultRetryCount = 100;
const maxDelayMs = 5000;
const minDelayMs = 10;
const slowDownCoefficient = 2;
const speedUpCoefficient = 1.5;

export class RetryAdapter<ContractType> implements Adapter<ContractType> {
    private adapter;

    private previousCallTimestampMs;

    private delayMs = minDelayMs;

    private retries;

    constructor(adapter: Adapter<ContractType>, retries = defaultRetryCount) {
        this.adapter = adapter;
        this.retries = retries;
        this.previousCallTimestampMs = Date.now();
    }

    createContract(address: string, abi: Abi): ContractType {
        return this.adapter.createContract(address, abi);
    }

    makeCall(contract: ContractData, target: FunctionCall): Promise<unknown> {
        return this.retry(
            this.adapter.makeCall(contract, target),
            this.retries,
        );
    }

    getChainId(): Promise<bigint> {
        return this.retry(this.adapter.getChainId(), this.retries);
    }

    isAddress(value: string): value is ContractAddress {
        return this.adapter.isAddress(value);
    }

    private async retry<ReturnType>(
        task: Promise<ReturnType>,
        retriesLeft: number,
    ): Promise<ReturnType> {
        await this.waitIfNeeded();

        const oneRetry = 1;

        try {
            const result = await task;
            this.delayMs = Math.max(
                this.delayMs / speedUpCoefficient,
                minDelayMs,
            );
            return result;
        } catch (exception) {
            if (retriesLeft) {
                this.delayMs = Math.min(
                    this.delayMs * slowDownCoefficient,
                    maxDelayMs,
                );
                return this.retry(task, retriesLeft - oneRetry);
            }
            throw exception;
        }
    }

    private async waitIfNeeded() {
        const now = Date.now();
        const timeFromPreviousCall = now - this.previousCallTimestampMs;
        this.previousCallTimestampMs = now;

        if (timeFromPreviousCall < this.delayMs) {
            await RetryAdapter.delay(this.delayMs - timeFromPreviousCall);
        }
    }

    private static delay(delayMs: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, delayMs);
        });
    }
}
