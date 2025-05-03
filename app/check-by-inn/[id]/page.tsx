'use client';

import { $api } from '@/shared/api/axios';
import { Line } from '@ant-design/plots';
import { Card, Col, Descriptions, Progress, Row, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;

interface YearlyActivity {
  year: number;
  total_contracts: number;
  total_sum: number;
}

interface ParticipantDetail {
  inn: string;
  status: string;
  main_okved: string;
  registration_date: string;
  msp_category: number | null;
  region: string;
  in_rnp: boolean;
  contracts_as_supplier_count: string;
  contracts_as_customer_count: string;
  participated_44fz: string;
  wins_44fz: string;
  participated_223fz: string;
  wins_223fz: string;
  participant_type: 'supplier_and_customer' | 'supplier' | 'customer' | 'unknown';
  win_rate_44fz: string;
  win_rate_223fz: string;
  yearly_activity: YearlyActivity[];
}

interface RatingResponse {
  totalRating: number;
  components: {
    businessRisks: {
      score: number;
      details: {
        terminations: number;
        complaints: number;
        enforcements: number;
      };
    };
    financialHealth: {
      score: number;
      metrics: {
        currentRatio: number;
        quickRatio: number;
        absoluteLiquidity: number;
        profitability: number;
        debtToEquity: number;
        cashFlowCoverage: number;
      };
      interpretation: string;
    };
  };
  ratingDate: string;
}

export default function ParticipantDetailPage({ params }: { params: { id: string } }) {
  const [participant, setParticipant] = useState<ParticipantDetail | null>(null);
  const [rating, setRating] = useState<RatingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [participantResponse, ratingResponse] = await Promise.all([
          $api.get<ParticipantDetail>(`/participants/${params.id}`),
          $api.get<RatingResponse>(`/rating/supplier/${params.id}`),
        ]);
        setParticipant(participantResponse.data);
        setRating(ratingResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading || !participant || !rating) {
    return <div>Загрузка...</div>;
  }

  const participantTypeMap = {
    supplier_and_customer: 'Поставщик и заказчик',
    supplier: 'Поставщик',
    customer: 'Заказчик',
    unknown: 'Неизвестно',
  };

  const config = {
    data: participant.yearly_activity,
    xField: 'year',
    yField: 'total_sum',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Информация об участнике</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title='Основная информация'>
            <Descriptions column={2}>
              <Descriptions.Item label='ИНН'>{participant.inn}</Descriptions.Item>
              <Descriptions.Item label='Статус'>{participant.status || '-'}</Descriptions.Item>
              <Descriptions.Item label='Основной ОКВЭД'>{participant.main_okved}</Descriptions.Item>
              <Descriptions.Item label='Дата регистрации'>
                {new Date(participant.registration_date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='Категория МСП'>
                {participant.msp_category || '-'}
              </Descriptions.Item>
              <Descriptions.Item label='Регион'>{participant.region}</Descriptions.Item>
              <Descriptions.Item label='В РНП'>
                {participant.in_rnp ? 'Да' : 'Нет'}
              </Descriptions.Item>
              <Descriptions.Item label='Тип участника'>
                {participantTypeMap[participant.participant_type]}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Statistic
              title='Общий рейтинг'
              value={rating.totalRating?.toFixed(2)}
              precision={2}
              suffix='/100'
            />
            <Progress percent={+rating.totalRating?.toFixed(2)} />
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Бизнес-риски'>
            <Statistic
              title='Оценка рисков'
              value={rating.components.businessRisks.score}
              suffix='/10'
            />
            <Descriptions column={1}>
              <Descriptions.Item label='Расторжения контрактов'>
                {rating.components.businessRisks.details.terminations}
              </Descriptions.Item>
              <Descriptions.Item label='Жалобы'>
                {rating.components.businessRisks.details.complaints}
              </Descriptions.Item>
              <Descriptions.Item label='Исполнительные производства'>
                {rating.components.businessRisks.details.enforcements}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Финансовое состояние'>
            <Statistic
              title='Оценка финансового состояния'
              value={rating.components.financialHealth.score?.toFixed(2)}
              precision={2}
              suffix='/100'
            />
            <Progress percent={+rating.components.financialHealth.score?.toFixed(2)} />

            <Descriptions title='Финансовые показатели' column={2}>
              <Descriptions.Item label='Коэффициент текущей ликвидности'>
                {rating.components.financialHealth.metrics.currentRatio?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label='Коэффициент быстрой ликвидности'>
                {rating.components.financialHealth.metrics.quickRatio?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label='Коэффициент абсолютной ликвидности'>
                {rating.components.financialHealth.metrics.absoluteLiquidity?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label='Рентабельность'>
                {(rating.components.financialHealth.metrics.profitability * 100)?.toFixed(2)}%
              </Descriptions.Item>
              <Descriptions.Item label='Долг/Капитал'>
                {rating.components.financialHealth.metrics.debtToEquity?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label='Покрытие денежным потоком'>
                {rating.components.financialHealth.metrics.cashFlowCoverage?.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Интерпретация:</Title>
              <p>{rating.components.financialHealth.interpretation}</p>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Статистика по контрактам'>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title='Контракты как поставщик'
                  value={participant.contracts_as_supplier_count}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title='Контракты как заказчик'
                  value={participant.contracts_as_customer_count}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Участие в закупках'>
            <Row gutter={16}>
              <Col span={12}>
                <Card type='inner' title='44-ФЗ'>
                  <Statistic title='Участий' value={participant.participated_44fz} />
                  <Statistic title='Побед' value={participant.wins_44fz} />
                  <Statistic title='Процент побед' value={participant.win_rate_44fz} suffix='%' />
                </Card>
              </Col>
              <Col span={12}>
                <Card type='inner' title='223-ФЗ'>
                  <Statistic title='Участий' value={participant.participated_223fz} />
                  <Statistic title='Побед' value={participant.wins_223fz} />
                  <Statistic title='Процент побед' value={participant.win_rate_223fz} suffix='%' />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Активность по годам'>
            <Line {...config} />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Descriptions.Item label='Дата оценки'>
              {new Date(rating.ratingDate).toLocaleDateString()}
            </Descriptions.Item>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
