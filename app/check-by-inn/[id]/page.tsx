'use client';

import { $api } from '@/shared/api/axios';
import { Card, Descriptions, Progress, Space, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;

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

export default function SupplierRatingPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState<RatingResponse | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await $api.get<RatingResponse>(`/rating/supplier/${params.id}`);
        setRating(data);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [params.id]);

  if (!rating) {
    return <div>Загрузка...</div>;
  }

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      <Title level={2}>Рейтинг поставщика</Title>

      <Card>
        <Statistic title='Общий рейтинг' value={rating.totalRating.toFixed(2)} precision={2} suffix='/100' />
        <Progress percent={+rating.totalRating.toFixed(2)} />
      </Card>

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

      <Card title='Финансовое состояние'>
        <Statistic
          title='Оценка финансового состояния'
          value={rating.components.financialHealth.score.toFixed(2)}
          precision={2}
          suffix='/100'
        />
        <Progress percent={+rating.components.financialHealth.score.toFixed(2)} />

        <Descriptions title='Финансовые показатели' column={2}>
          <Descriptions.Item label='Коэффициент текущей ликвидности'>
            {rating.components.financialHealth.metrics.currentRatio.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Коэффициент быстрой ликвидности'>
            {rating.components.financialHealth.metrics.quickRatio.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Коэффициент абсолютной ликвидности'>
            {rating.components.financialHealth.metrics.absoluteLiquidity.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Рентабельность'>
            {(rating.components.financialHealth.metrics.profitability * 100).toFixed(2)}%
          </Descriptions.Item>
          <Descriptions.Item label='Долг/Капитал'>
            {rating.components.financialHealth.metrics.debtToEquity.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Покрытие денежным потоком'>
            {rating.components.financialHealth.metrics.cashFlowCoverage.toFixed(2)}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Title level={5}>Интерпретация:</Title>
          <p>{rating.components.financialHealth.interpretation}</p>
        </div>
      </Card>

      <Card>
        <Descriptions.Item label='Дата оценки'>
          {new Date(rating.ratingDate).toLocaleDateString()}
        </Descriptions.Item>
      </Card>
    </Space>
  );
}
