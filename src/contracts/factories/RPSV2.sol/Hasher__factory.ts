/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Hasher, HasherInterface } from "../../RPSV2.sol/Hasher";

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_c",
        type: "uint8",
      },
      {
        name: "_salt",
        type: "uint256",
      },
    ],
    name: "hash",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610113806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806367ef4c13146044575b600080fd5b348015604f57600080fd5b506079600480360381019080803560ff169060200190929190803590602001909291905050506097565b60405180826000191660001916815260200191505060405180910390f35b60008282604051808360ff1660ff167f01000000000000000000000000000000000000000000000000000000000000000281526001018281526020019250505060405180910390209050929150505600a165627a7a723058200c28dcc0de6381913031280157dd00bf0ad7a4daa362d2e4fa355a7c45048f610029";

type HasherConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HasherConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Hasher__factory extends ContractFactory {
  constructor(...args: HasherConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Hasher> {
    return super.deploy(overrides || {}) as Promise<Hasher>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Hasher {
    return super.attach(address) as Hasher;
  }
  override connect(signer: Signer): Hasher__factory {
    return super.connect(signer) as Hasher__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HasherInterface {
    return new utils.Interface(_abi) as HasherInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Hasher {
    return new Contract(address, _abi, signerOrProvider) as Hasher;
  }
}
