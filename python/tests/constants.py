import os
from dotenv import load_dotenv
from eth_keys.datatypes import PrivateKey
load_dotenv()

ENDPOINT = os.environ['ENDPOINT'] or os.getenv('ENDPOINT')

ETH_PUBLIC_KEY = "0x0D9DFA0c6Def27DB232639011Fca27eb478D7baB"

EUROPA_ENDPOINT = "https://mainnet.skalenodes.com/v1/elated-tan-skat"
