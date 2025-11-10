"""Module for skale contracts cache"""

from __future__ import annotations
import os
import shutil
from pathlib import Path
from abc import ABC, abstractmethod

from .project_factory import SkaleProject

from .constants import METADATA_FILENAME


BASE_CACHE_PREFIX = 'sc-'


class Cache(ABC):
    """Optional cache for storing downloaded artifacts"""

    @abstractmethod
    def metadata(self) -> str | None:
        """Retrieve cached metadata."""

    @abstractmethod
    def cache_metadata(self, metadata: str) -> None:
        """Store metadata in cache."""

    @abstractmethod
    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        """Retrieve cached ABI for a specific project and version."""

    @abstractmethod
    def cache_abi(
        self,
        project_name: SkaleProject,
        version: str,
        abi: str
    ) -> None:
        """Store ABI in cache for a specific project and version."""

    @abstractmethod
    def instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str
    ) -> str | None:
        """Retrieve cached instance data
        for a specific project, alias, and network."""

    @abstractmethod
    def cache_instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str,
        data: str
    ) -> None:
        """Cache instance data
        for a specific project, alias, and network."""

    def _metadata_filename(self) -> str:
        """Generate the cache key for metadata."""
        return f'{BASE_CACHE_PREFIX}{METADATA_FILENAME}'

    def _abi_filename(
        self,
        project_name: SkaleProject,
        version: str
    ) -> str:
        """Generate the cache key for an ABI file."""
        return f'{BASE_CACHE_PREFIX}{project_name.value}-{version}.json'

    def _instance_data_filename(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str
    ) -> str:
        """Generate the cache key for instance data."""
        return f'{BASE_CACHE_PREFIX}{project_name.value}' + \
            f'-{network_name}-{alias}.json'


class MemoryCache(Cache):
    """In-memory cache implementation."""

    def __init__(self) -> None:
        """Initialize an empty in-memory cache."""
        self._cache: dict[str, str] = {}

    def metadata(self) -> str | None:
        """Retrieve cached metadata from memory."""
        return self._cache.get(self._metadata_filename())

    def cache_metadata(self, metadata: str) -> None:
        """Store metadata in memory cache."""
        self._cache[self._metadata_filename()] = metadata

    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        """Retrieve cached ABI from memory."""
        return self._cache.get(self._abi_filename(project_name, version))

    def cache_abi(
        self,
        project_name: SkaleProject,
        version: str,
        abi: str
    ) -> None:
        """Store ABI in memory cache."""
        self._cache[self._abi_filename(project_name, version)] = abi

    def instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str
    ) -> str | None:
        """Retrieve cached instance data from memory."""
        return self._cache.get(
            self._instance_data_filename(project_name, network_name, alias)
        )

    def cache_instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str,
        data: str
    ) -> None:
        """Store instance data in memory cache."""
        self._cache[
            self._instance_data_filename(project_name, network_name, alias)
        ] = data


class DiskCache(Cache):
    """Disk-based cache implementation for persistent storage."""

    def __init__(
        self,
        cache_dir: str,
        cleanup_on_init: bool = False,
    ) -> None:
        """Initialize a disk-based cache."""
        self._cache_dir = cache_dir
        self.cache_path = Path(cache_dir).expanduser().resolve()
        self._prepare_cache_dir(cleanup_on_init)

    def _prepare_cache_dir(self, cleanup_on_init: bool = False) -> None:
        """Prepare the cache directory for use."""
        if cleanup_on_init and self.cache_path.exists():
            shutil.rmtree(self.cache_path)
        os.makedirs(self.cache_path, exist_ok=True)

    def _read_str(self, file_path: Path) -> str | None:
        """Read a string from a file."""
        if file_path.exists():
            return file_path.read_text(encoding='utf-8')
        return None

    def _write_str(self, file_path: Path, content: str) -> None:
        """Write a string to a file."""
        file_path.write_text(content, encoding='utf-8')

    def _metadata_path(self) -> Path:
        """Generate the file path for metadata storage."""
        return self.cache_path / self._metadata_filename()

    def metadata(self) -> str | None:
        """Retrieve cached metadata from disk."""
        return self._read_str(self._metadata_path())

    def cache_metadata(self, metadata: str) -> None:
        """Store metadata to disk cache."""
        return self._write_str(self._metadata_path(), metadata)

    def abi(self, project_name: SkaleProject, version: str) -> str | None:
        """Retrieve cached ABI from disk."""
        return self._read_str(self.abi_file_path(project_name, version))

    def cache_abi(
        self,
        project_name: SkaleProject,
        version: str,
        abi: str
    ) -> None:
        """Store ABI to disk cache."""
        return self._write_str(
            self.abi_file_path(project_name, version),
            abi
        )

    def abi_file_path(
        self,
        project_name: SkaleProject,
        version: str
    ) -> Path:
        """Generate the file path for an ABI file."""
        return self.cache_path / self._abi_filename(project_name, version)

    def instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str
    ) -> str | None:
        """Retrieve cached instance data from disk."""
        return self._read_str(
            self._instance_data_file_path(project_name, network_name, alias)
        )

    def cache_instance_data(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str,
        data: str
    ) -> None:
        """Store instance data to disk cache."""
        return self._write_str(
            self._instance_data_file_path(project_name, network_name, alias),
            data
        )

    def _instance_data_file_path(
        self,
        project_name: SkaleProject,
        network_name: str,
        alias: str
    ) -> Path:
        """Generate the file path for instance data."""
        return self.cache_path / self._instance_data_filename(
            project_name, network_name, alias
        )
