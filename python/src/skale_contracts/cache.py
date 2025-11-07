"""Module for skale contracts cache"""

import os
import shutil
from pathlib import Path
from abc import ABC, abstractmethod

from skale_contracts.project_factory import SkaleProject

from .constants import METADATA_FILENAME


BASE_CACHE_PREFIX = 'sc-'


class Cache(ABC):
    """Optional cache for storing downloaded artifacts"""

    def __init__(
        self,
        cleanup_on_init: bool = False,
    ) -> None:
        self.cleanup_on_init = cleanup_on_init

    @abstractmethod
    def metadata(self) -> str | None:
        pass

    @abstractmethod
    def cache_metadata(self, metadata: str) -> None:
        pass

    @abstractmethod
    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        pass

    @abstractmethod
    def cache_abi(self, project_name: SkaleProject, version: str, abi: str) -> None:
        pass


class MemoryCache(Cache):
    def __init__(self) -> None:
        self._cache: dict[str, str] = {}

    def _metadata_path(self) -> str:
        return f'{BASE_CACHE_PREFIX}{METADATA_FILENAME}'

    def metadata(self) -> str | None:
        return self._cache.get(self._metadata_path())

    def cache_metadata(self, metadata: str) -> None:
        self._cache[self._metadata_path()] = metadata

    def _abi_path(self, project_name: SkaleProject, version: str) -> str:
        return f'{BASE_CACHE_PREFIX}{project_name.value}-{version}.json'

    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        return self._cache.get(self._abi_path(project_name, version))

    def cache_abi(self, project_name: SkaleProject, version: str, abi: str) -> None:
        self._cache[self._abi_path(project_name, version)] = abi


class DiskCache(Cache):
    def __init__(
        self,
        cache_dir: str,
        cleanup_on_init: bool = False,
    ) -> None:
        self._cache_dir = cache_dir
        self.cache_path = Path(cache_dir).expanduser().resolve()
        self._prepare_cache_dir(cleanup_on_init)

    def _prepare_cache_dir(self, cleanup_on_init: bool = False) -> None:
        if cleanup_on_init and self.cache_path.exists():
            shutil.rmtree(self.cache_path)
        os.makedirs(self.cache_path, exist_ok=True)

    def _read_str(self, file_path: Path) -> str | None:
        if file_path.exists():
            return file_path.read_text(encoding='utf-8')
        return None

    def _write_str(self, file_path: Path, content: str) -> None:
        file_path.write_text(content, encoding='utf-8')

    def _metadata_path(self) -> Path:
        return self.cache_path / f'{BASE_CACHE_PREFIX}{METADATA_FILENAME}'

    def metadata(self) -> str | None:
        return self._read_str(self._metadata_path())

    def cache_metadata(self, metadata: str) -> None:
        return self._write_str(self._metadata_path(), metadata)

    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        return self._read_str(self.abi_file_path(project_name, version))

    def cache_abi(self, project_name: SkaleProject, version: str, abi: str) -> None:
        return self._write_str(self.abi_file_path(project_name, version), abi)

    def abi_file_path(self, project_name: SkaleProject, version: str) -> Path:
        return self.cache_path / f'{project_name.value}-{version}.json'
