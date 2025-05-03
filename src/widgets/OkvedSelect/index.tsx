'use client';

import { $api } from '@/shared/api/axios';
import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

interface OkvedItem {
  id: number;
  code: string;
  description: string;
  level: number;
}

interface TreeData {
  title: string;
  value: string;
  children?: TreeData[];
  isLeaf?: boolean;
}

export const OkvedSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  console.log(treeData);
  const loadFirstLevel = async () => {
    try {
      const { data } = await $api.get<OkvedItem[]>('/okved?level=1');
      const formattedData = data.map((item) => ({
        title: `${item.code} - ${item.description}`,
        value: item.code,
        isLeaf: false,
      }));
      setTreeData(formattedData);
    } catch (error) {
      console.error('Error loading first level:', error);
    }
  };

  const loadChildren = async (parentCode: string, level: number) => {
    try {
      const { data } = await $api.get<OkvedItem[]>(
        `/okved?level=${level}&parentCode=${parentCode}`,
      );
      return data.map((item) => ({
        title: `${item.code} - ${item.description}`,
        value: item.code,
        isLeaf: level >= 3,
      }));
    } catch (error) {
      console.error('Error loading children:', error);
      return [];
    }
  };

  const onLoadData = async ({ value, children }: any) => {
    if (children) return;
    const level = value.split('.').length + 1;
    const newChildren = await loadChildren(value, level);
    setTreeData((prev) => {
      const updateTreeData = (data: TreeData[]): TreeData[] => {
        return data.map((node) => {
          if (node.value === value) {
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
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={onChange}
      loadData={onLoadData}
      
      placeholder='Выберите ОКВЭД'
      allowClear
      style={{ width: '100%' }}
    />
  );
};
