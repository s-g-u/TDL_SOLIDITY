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

Primero necesitan cambiar su terminal de cmd a bash, lo pueden hacer desde VS CODE.

1. Ctrl + Shift + P
2. Escribe Terminal: Select Default Profile → seleccionen Git Bash
3. Ahora ya pueden ejecutar los comandos de Foundry.

4. Instalar Foundry

```shell
$ curl -L https://foundry.paradigm.xyz | bash
```

5. Luego recargar la terminal y ejecutar el comando:

```shell
$ foundryup
```

6. Instalar forge-std

```shell
$ forge install foundry-rs/forge-std
```

7. Compilar el proyecto

```shell
$ forge build
```

8. Correr Anvil (local node)

```shell
$ anvil
```

# Extensiones de VSCode
a. Solidity (icono amarillo)
b. Even Better TOML (icono blanco y rojo)
