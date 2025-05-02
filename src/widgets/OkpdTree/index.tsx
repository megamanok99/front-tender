'use client';

import { $api } from '@/shared/api/axios';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

interface OkpdItem {
  id: number;
  code: string;
  description: string;
  level: number;
}

interface TreeData {
  title: string;
  key: string;
  children?: TreeData[];
  isLeaf?: boolean;
}

export const OkpdTree = () => {
  const [treeData, setTreeData] = useState<TreeData[]>([]);

  const loadFirstLevel = async () => {
    try {
      const { data } = await $api.get<OkpdItem[]>('/okpd?level=1');
      const formattedData = data.map((item) => ({
        title: `${item.code} - ${item.description}`,
        key: item.code,
        isLeaf: false,
      }));
      setTreeData(formattedData);
    } catch (error) {
      console.error('Error loading first level:', error);
    }
  };

  const loadChildren = async (parentCode: string, level: number) => {
    try {
      const { data } = await $api.get<OkpdItem[]>(`/okpd?level=${level}&parentCode=${parentCode}`);
      return data.map((item) => ({
        title: `${item.code} - ${item.description}`,
        key: item.code,
        isLeaf: level >= 4, // Предполагаем, что максимальный уровень - 3
      }));
    } catch (error) {
      console.error('Error loading children:', error);
      return [];
    }
  };

  const onLoadData = async ({ key, children }: any) => {
    if (children) return;
    const level = key.split('.').length + 1;
    const newChildren = await loadChildren(key, level);
    setTreeData((prev) => {
      const updateTreeData = (data: TreeData[]): TreeData[] => {
        return data.map((node) => {
          if (node.key === key) {
            return {
              ...node,
              children: newChildren,
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateTreeData(node.children),
            };
          }
          return node;
        });
      };
      return updateTreeData(prev);
    });
  };

  useEffect(() => {
    loadFirstLevel();
  }, []);

  return (
    <div style={{ maxWidth: '800px' }}>
      <Tree loadData={onLoadData} treeData={treeData} showLine showIcon />
    </div>
  );
};
