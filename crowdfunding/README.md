## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
# PASO A PASO PARA LEVANTAR EL PROYECTO #

1. Instalar Foundry

```shell
$ curl -L https://foundry.paradigm.xyz | bash
```

2. Luego recargar la terminal y ejecutar el comando:

```shell
$ foundryup
```

3. Compilar el proyecto

```shell
$ forge build
```

4. Correr Anvil (local node)

```shell
$ anvil
```

# Extensiones de VSCode
1. Solidity (icono amarillo)
2. Even Better TOML (icono blanco y rojo)
