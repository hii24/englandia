'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function TestMaterialsPermissions() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore(s => s.user);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lessons');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    } finally {
      setLoading(false);
    }
  };

  const canEditMaterial = (material: any) => {
    return !material.createdBy || material.createdBy === user?._id;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Тест прав доступа к материалам</h1>
      
      <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
        <h3>Информация о пользователе:</h3>
        <p><strong>ID:</strong> {user?._id || 'Не авторизован'}</p>
        <p><strong>Роль:</strong> {user?.role || 'Неизвестно'}</p>
        <p><strong>Имя:</strong> {user?.firstName} {user?.lastName}</p>
      </div>

      {loading ? (
        <div>Загрузка уроков...</div>
      ) : (
        <div>
          <h2>Уроки и их материалы:</h2>
          {lessons.map((lesson) => (
            <div key={lesson._id} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3>Урок {lesson.orderNumber}: {lesson.title}</h3>
              <p>{lesson.description}</p>
              
              {lesson.materials && lesson.materials.length > 0 && (
                <div>
                  <h4>Материалы:</h4>
                  {lesson.materials.map((material: any, index: number) => (
                    <div 
                      key={index} 
                      style={{ 
                        margin: '8px 0', 
                        padding: '12px', 
                        background: canEditMaterial(material) ? '#f0fdf4' : '#fef3c7',
                        border: `1px solid ${canEditMaterial(material) ? '#22c55e' : '#f59e0b'}`,
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{material.title}</strong>
                          <br />
                          <small>URL: {material.url}</small>
                          <br />
                          <small>Тип: {material.type}</small>
                          <br />
                          <small>Для ученика: {material.forStudent ? 'Да' : 'Нет'}</small>
                        </div>
                        <div>
                          {material.createdBy ? (
                            <span style={{ 
                              background: material.createdBy === user?._id ? '#22c55e' : '#f59e0b',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {material.createdBy === user?._id ? 'Ваш материал' : 'Создан админом'}
                            </span>
                          ) : (
                            <span style={{ 
                              background: '#6b7280',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              Старый материал
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ 
                          background: canEditMaterial(material) ? '#22c55e' : '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {canEditMaterial(material) ? 'Можно редактировать' : 'Нельзя редактировать'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 