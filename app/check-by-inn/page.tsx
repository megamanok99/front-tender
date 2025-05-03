'use client';

import { $api } from '@/shared/api/axios';
import { OkvedSelect } from '@/widgets/OkvedSelect';
import { Input, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Participant {
  inn: string;
  status: string;
  main_okved: string;
  registration_date: string;
  msp_category: number | null;
  region: string;
  in_rnp: boolean;
  contracts_as_supplier_count: string;
  contracts_as_customer_count: string;
  participant_type: 'supplier_and_customer' | 'supplier' | 'customer' | 'unknown';
}

interface ParticipantsResponse {
  data: Participant[];
  total: number;
  page: string;
  limit: string;
}

export default function CheckByInnPage() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedOkved, setSelectedOkved] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const router = useRouter();

  const columns = [
    {
      title: 'ИНН',
      dataIndex: 'inn',
      key: 'inn',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Основной ОКВЭД',
      dataIndex: 'main_okved',
      key: 'main_okved',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'registration_date',
      key: 'registration_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Категория МСП',
      dataIndex: 'msp_category',
      key: 'msp_category',
      render: (category: number | null) => category || '-',
    },
    {
      title: 'Регион',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'В РНП',
      dataIndex: 'in_rnp',
      key: 'in_rnp',
      render: (inRnp: boolean) => (inRnp ? 'Да' : 'Нет'),
    },
    {
      title: 'Тип участника',
      dataIndex: 'participant_type',
      key: 'participant_type',
      render: (type: string) => {
        const types = {
          supplier_and_customer: 'Поставщик и заказчик',
          supplier: 'Поставщик',
          customer: 'Заказчик',
          unknown: 'Неизвестно',
        };
        return types[type as keyof typeof types] || type;
      },
    },
    {
      title: 'Контракты как поставщик',
      dataIndex: 'contracts_as_supplier_count',
      key: 'contracts_as_supplier_count',
    },
    {
      title: 'Контракты как заказчик',
      dataIndex: 'contracts_as_customer_count',
      key: 'contracts_as_customer_count',
    },
  ];

  const fetchParticipants = async (page: number = 1, limit: number = 10, okvedValue?: string) => {
    try {
      console.log('Fetching participants...', { searchValue, okvedValue, page, limit });
      setLoading(true);
      const { data } = await $api.get<ParticipantsResponse>('/participants', {
        params: {
          search: searchValue,
          okved: okvedValue || selectedOkved,
          page,
          limit,
        },
      });
      console.log('Received data:', data);
      setParticipants(data.data);
      setPagination({
        current: Number(data.page),
        pageSize: Number(data.limit),
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    await fetchParticipants(1);
  };

  const handleOkvedChange = async (value: string) => {
    console.log('Selected OKVED:', value);
    setSelectedOkved(value);
    await fetchParticipants(1, 10, value);
  };

  const handleTableChange = async (pagination: any) => {
    await fetchParticipants(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <>
      <h1>Проверка по ИНН</h1>
      <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
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
        <div style={{ width: 300 }}>
          <OkvedSelect value={selectedOkved} onChange={handleOkvedChange} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={participants}
        rowKey='inn'
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={(record) => ({
          onDoubleClick: () => router.push(`/check-by-inn/${record.inn}`),
        })}
      />
    </>
  );
}
