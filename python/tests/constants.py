"""Module with constants used for tests"""

import os
from dotenv import load_dotenv

from skale_contracts.project_factory import SkaleProject
load_dotenv()

MAINNET_ENDPOINT = os.environ['ENDPOINT'] or os.getenv('ENDPOINT') or None

if MAINNET_ENDPOINT is None:
    raise ValueError("ENDPOINT env variable for mainnet node is not set")

EUROPA_ENDPOINT = "https://mainnet.skalenodes.com/v1/elated-tan-skat"

MOCK_ADDRESS = "0x000000000000000000000000000000000000dead"

MAINNET_PROJECTS = [
    SkaleProject.MAINNET_IMA,
    SkaleProject.SKALE_ALLOCATOR,
    SkaleProject.SKALE_MANAGER,
    SkaleProject.ERC1820
]

NOT_DEPLOYED = [
    SkaleProject.MIRAGE_MANAGER
]

EUROPA_PROJECTS = [
    project for project in SkaleProject if (
        project not in set(MAINNET_PROJECTS) and
        project not in set(NOT_DEPLOYED)
    )
]

SCHAIN_NOT_PREDEPLOYED = [SkaleProject.PAYMASTER]
