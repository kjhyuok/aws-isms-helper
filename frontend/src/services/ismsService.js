import axios from 'axios';

// API Gateway 엔드포인트 URL
const API_URL = 'https://rr8d8vtai0.execute-api.us-east-1.amazonaws.com/prod';

// AWS 계정 스캔 함수
export const scanAwsAccount = async (accountId = '195275662470', region = 'us-east-1') => {
  try {
    console.log('ismsService: 스캔 API 호출', accountId, region);
    const response = await axios.post(`${API_URL}/scan`, {
      account_id: accountId,
      region: region
    });
    
    console.log('ismsService: 스캔 API 응답', response.data);
    return response.data;
  } catch (error) {
    console.error('ismsService: 스캔 중 오류 발생:', error);
    throw error;
  }
};

// DynamoDB에서 최신 스캔 결과 가져오기
export const getLatestScanResult = async (accountId = '195275662470') => {
  try {
    console.log('ismsService: 결과 조회 API 호출', accountId);
    const response = await axios.post(`${API_URL}/results`, {
      account_id: accountId
    });
    
    console.log('ismsService: 결과 조회 API 응답', response.data);
    
    // API 응답이 문자열인 경우 JSON으로 파싱
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('ismsService: 결과 조회 중 오류 발생:', error);
    throw error;
  }
};

// 모의 데이터는 그대로 유지 (API 호출 실패 시 폴백으로 사용)
export const getMockScanResult = () => {
  console.log('ismsService: 모의 데이터 반환');
  return {
    compliance_summary: {
      total_items: 11,
      compliant_items: 5,
      overall_percentage: 45.45,
      section_summary: {
        "2.5": {
          total: 3,
          compliant: 1,
          percentage: 33.33
        },
        "2.6": {
          total: 1,
          compliant: 1,
          percentage: 100
        },
        "2.7": {
          total: 2,
          compliant: 2,
          percentage: 100
        },
        "2.9": {
          total: 2,
          compliant: 1,
          percentage: 50
        },
        "2.10": {
          total: 3,
          compliant: 0,
          percentage: 0
        }
      }
    },
    isms_mapping: {
      "2.5": {
        items: [
          {
            id: "2.5.1",
            name: "사용자 인증",
            compliant: false,
            details: {
              mfa_percentage: 0,
              users_without_mfa: ["kjhyuok"]
            }
          },
          {
            id: "2.5.2",
            name: "사용자 계정 관리",
            compliant: true,
            details: {
              old_access_keys: []
            }
          },
          {
            id: "2.5.3",
            name: "비밀번호 관리",
            compliant: false,
            details: {
              password_policy: null
            }
          }
        ]
      },
      "2.6": {
        items: [
          {
            id: "2.6.1",
            name: "네트워크 접근통제",
            compliant: true,
            details: {
              risky_security_groups: []
            }
          }
        ]
      },
      "2.7": {
        items: [
          {
            id: "2.7.1",
            name: "저장 데이터 암호화",
            compliant: true,
            details: {
              s3_encryption: [
                {
                  bucket_name: "aws-athena-query-results-195275662470-us-east-1",
                  encryption_enabled: true,
                  encryption_type: "AES256"
                }
              ],
              rds_encryption: []
            }
          },
          {
            id: "2.7.2",
            name: "암호키 관리",
            compliant: true,
            details: {
              kms_keys: [
                {
                  key_id: "40edce25-f3b3-4c20-a54f-c49889b19dc0",
                  key_state: "Enabled",
                  key_rotation_enabled: true
                }
              ]
            }
          }
        ]
      },
      "2.9": {
        items: [
          {
            id: "2.9.1",
            name: "로그 관리",
            compliant: true,
            details: {
              cloudtrail: [
                {
                  trail_name: "AP_DB_AUTH_TRAIL",
                  is_multi_region: true,
                  is_logging: true,
                  log_file_validation_enabled: true
                }
              ]
            }
          },
          {
            id: "2.9.2",
            name: "보안 모니터링",
            compliant: false,
            details: {
              security_alarms: []
            }
          }
        ]
      },
      "2.10": {
        items: [
          {
            id: "2.10.1",
            name: "보안 시스템 운영",
            compliant: false,
            details: {
              waf_acls: []
            }
          },
          {
            id: "2.10.2",
            name: "DDoS 대응",
            compliant: false,
            details: {
              shield_active: false
            }
          },
          {
            id: "2.10.3",
            name: "취약점 관리",
            compliant: false,
            details: {
              inspector_active: false
            }
          }
        ]
      }
    }
  };
};
