'use client';

import { $api } from '@/shared/api/axios';
import { Input, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Supplier {
  id: string;
  name: string;
  inn: string;
}

export default function CheckByInnPage() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const columns = [
    {
      title: 'ИНН',
      dataIndex: 'inn',
      key: 'inn',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const handleSearch = async (value: string) => {
    if (value.length === 10 || value.length === 12) {
      try {
        const { data } = await $api.get<Supplier[]>(`/suppliers/search?inn=${value}`);
        // Здесь можно добавить обработку данных
      } catch (error) {
        console.error('Error searching suppliers:', error);
      }
    }
  };

  return (
    <>
      <h1>Проверка по ИНН</h1>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder='Введите ИНН'
          allowClear
          enterButton='Поиск'
          size='large'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 500 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={[]}
        rowKey='id'
        onRow={(record) => ({
          onClick: () => router.push(`/check-by-inn/${record.inn}`),
        })}
      />
    </>
  );
}
