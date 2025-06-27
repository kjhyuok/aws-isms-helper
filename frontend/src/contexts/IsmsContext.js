import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLatestScanResult, getMockScanResult } from '../services/ismsService';

const IsmsContext = createContext();

export const IsmsProvider = ({ children }) => {
  const [ismsData, setIsmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);

  const fetchIsmsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // 실제 API 호출
        console.log('IsmsContext: API 호출 시작');
        const data = await getLatestScanResult();
        console.log('IsmsContext: API 응답 데이터', data);
        
        if (data && data.isms_mapping) {
          setIsmsData(data);
          setLastScanTime(new Date().toISOString());
          console.log('IsmsContext: 실제 API 데이터 설정 완료');
        } else {
          console.log('IsmsContext: API 응답에 유효한 데이터가 없어 모의 데이터 사용');
          // API 응답이 유효하지 않으면 모의 데이터 사용
          const mockData = getMockScanResult();
          setIsmsData(mockData);
          setLastScanTime(new Date().toISOString());
        }
      } catch (apiError) {
        console.error('IsmsContext: API 호출 실패, 모의 데이터 사용:', apiError);
        // API 호출 실패 시 모의 데이터 사용
        const mockData = getMockScanResult();
        setIsmsData(mockData);
        setLastScanTime(new Date().toISOString());
      }
    } catch (err) {
      console.error('IsmsContext: 데이터 로딩 오류:', err);
      setError('ISMS 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    console.log('IsmsContext: 초기 데이터 로드 시작');
    fetchIsmsData();
  }, []);

  return (
    <IsmsContext.Provider value={{ ismsData, loading, error, fetchIsmsData, lastScanTime }}>
      {children}
    </IsmsContext.Provider>
  );
};

export const useIsms = () => useContext(IsmsContext);
