División de tareas:

Matías Leguizamón:
- Estructura base del Crowdfunding.sol, todo el frontend, walletService.

Sol Guadalupe Urbano:
- Implementé el contrato NFT y lo integré al contrato CrowdFunding.
- Agregué la función rewardRandomFunder para premiar aleatoriamente a un aportante con un NFT.
- Subí el NFT a IPFS utilizando Pinata, y utilicé su URI dentro del contrato.
- Desarrollé un contrato ERC20 (CashbackToken) y lo integré a CrowdFunding.
- Implementé la lógica de cashback: al recibir fondos, el contrato otorga un porcentaje al aportante en tokens CBK.
- Incorporé un deadline y un objetivo de recaudación en USD al contrato CrowdFunding.
- Modifiqué el script de deploy para:
  - Desplegar los contratos NFT y CashbackToken correctamente,
  - Transferir la propiedad del NFT al contrato CrowdFunding para que pueda emitir recompensas.

Alvaro, Farias:
- Armé el ambiente y desplegué el proyecto para que funcione con Hardhat.
- Desarrollé la función  Refund, para que los aportante recupere su dinero en caso de que la meta de financiamiento no se haya cumplido.
- Desarrollé la función getProgress, para calcular el porcentaje de avance del fondeo.
- Desarrollé contratos upgradeables con la libreria OpenZeppelin, utilizando Initializable, OwnableUpgradeable y UUPSUpgradeable
- Implementé el patrón UUPS Proxy, configurando un contrato proxy que delega a un contrato lógico actualizable, manteniendo persistencia del estado.
- Realicé el despliegue del contrato CrowdFunding en la red de pruebas Sepolia.
- Armé un ejemplo simple del contrato para ser probado en Remix.
