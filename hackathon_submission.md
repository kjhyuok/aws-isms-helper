# ISMS 지원 도우미 - 해커톤 제출 자료

## 2. 프로젝트 개요

### 2-1. 문제 정의

기업들이 정보보호 관리체계(ISMS) 인증을 획득하고 유지하는 과정은 복잡하고 시간이 많이 소요됩니다. 주요 문제점은 다음과 같습니다:

- **복잡한 인증 요구사항**: ISMS는 80개 이상의 통제항목과 수백 개의 세부 점검항목으로 구성되어 있어 관리가 어렵습니다.
- **진행 상황 파악의 어려움**: 인증 준비 과정에서 각 항목별 진행 상황을 실시간으로 파악하기 어렵습니다.
- **전문 지식 부족**: 많은 기업들이 ISMS 인증에 필요한 전문 지식이 부족하여 외부 컨설팅에 의존합니다.
- **보고서 작성의 번거로움**: 인증 관련 보고서 작성이 수작업으로 이루어져 시간이 많이 소요됩니다.
- **AWS 환경에서의 보안 설정 복잡성**: AWS 서비스를 사용하는 기업들은 클라우드 환경에서의 ISMS 요구사항 충족을 위한 설정이 복잡합니다.

### 2-2. 솔루션 개요

ISMS 지원 도우미는 AWS 환경에서 ISMS 인증을 준비하는 기업들을 위한 종합적인 웹 기반 솔루션입니다:

- **통합 대시보드**: ISMS 인증 현황을 한눈에 파악할 수 있는 시각화 도구 제공
- **자동화된 보안 점검**: AWS 계정의 보안 설정을 자동으로 스캔하여 ISMS 요구사항 충족 여부 확인
- **맞춤형 보고서**: 인증 항목별 상태 보고서 자동 생성 및 PDF/Excel 형식 출력
- **Amazon Q 기반 챗봇**: ISMS 인증 관련 질의응답 및 가이드 제공
- **실시간 모니터링**: 보안 설정 변경 및 위험 요소 실시간 감지

### 2-3. 비즈니스 임팩트

- **인증 준비 시간 단축**: 자동화된 점검 및 보고서 생성으로 인증 준비 시간 50% 이상 단축
- **비용 절감**: 외부 컨설팅 의존도 감소로 인증 비용 30% 절감
- **보안 수준 향상**: 지속적인 모니터링으로 보안 취약점 조기 발견 및 조치
- **규제 준수 용이성**: 규제 변화에 따른 요구사항 업데이트 자동화
- **의사결정 지원**: 경영진에게 보안 현황에 대한 명확한 가시성 제공

## 3. 주요 코드 및 아키텍처 설명

### 아키텍처 다이어그램

```
+----------------------------------+
|        사용자 인터페이스          |
|  +----------------------------+  |
|  |       React 프론트엔드      |  |
|  |  (Material UI 컴포넌트)    |  |
|  +----------------------------+  |
+----------------------------------+
              |
              v
+----------------------------------+
|         AWS Amplify              |
| +------------------------------+ |
| |     인증 및 권한 관리        | |
| |   (Amazon Cognito 연동)      | |
| +------------------------------+ |
+----------------------------------+
              |
              v
+----------------------------------+
|        백엔드 서비스             |
| +------------------------------+ |
| |   AWS Lambda 함수            | |
| |   - 보안 스캔 서비스         | |
| |   - 보고서 생성 서비스       | |
| |   - ISMS 체크리스트 관리     | |
| +------------------------------+ |
+----------------------------------+
              |
              v
+----------------------------------+
|        데이터 스토리지           |
| +------------------------------+ |
| |   Amazon DynamoDB            | |
| |   - ISMS 체크리스트 데이터   | |
| |   - 사용자 설정 및 진행 상태 | |
| +------------------------------+ |
| +------------------------------+ |
| |   Amazon S3                  | |
| |   - 보고서 저장              | |
| |   - 증적 자료 저장           | |
| +------------------------------+ |
+----------------------------------+
              |
              v
+----------------------------------+
|        통합 서비스               |
| +------------------------------+ |
| |   Amazon Q 통합              | |
| |   - ISMS 관련 질의응답       | |
| |   - 권장 조치 제안           | |
| +------------------------------+ |
| +------------------------------+ |
| |   AWS Security Hub           | |
| |   - 보안 상태 모니터링       | |
| |   - 규정 준수 점검           | |
| +------------------------------+ |
+----------------------------------+
```

### 주요 코드 설명

#### 1. Amazon Q 챗봇 통합 (AmazonQChatbot.js)

```javascript
// Amazon Q와의 통합을 위한 핵심 코드
const handleSend = async () => {
  if (input.trim() === '') return;
  
  // 사용자 메시지 추가
  setMessages([...messages, { text: input, sender: 'user' }]);
  setInput('');
  
  try {
    // Amazon Q API 호출
    const response = await API.post('ismsApi', '/chat', {
      body: {
        query: input,
        context: {
          isms_section: currentSection || 'general',
          company_profile: companyProfile
        }
      }
    });
    
    // 응답 처리
    setMessages(prev => [...prev, { 
      text: response.message, 
      sender: 'bot',
      links: response.links || [] 
    }]);
  } catch (error) {
    console.error('Amazon Q API 오류:', error);
    setMessages(prev => [...prev, { 
      text: '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.', 
      sender: 'bot' 
    }]);
  }
};
```

#### 2. 보안 스캔 서비스 (Lambda 함수)

```python
def lambda_handler(event, context):
    """
    AWS 환경의 보안 설정을 스캔하고 ISMS 요구사항 충족 여부를 확인하는 Lambda 함수
    """
    try:
        # 사용자 계정 정보 가져오기
        account_id = event['account_id']
        region = event['region']
        
        # 임시 자격 증명으로 세션 생성
        session = assume_role_session(account_id, region)
        
        # 보안 점검 실행
        results = {
            'iam': check_iam_compliance(session),
            'cloudtrail': check_cloudtrail_compliance(session),
            's3': check_s3_compliance(session),
            'kms': check_kms_compliance(session),
            'network': check_network_compliance(session),
            'guardduty': check_guardduty_compliance(session)
        }
        
        # ISMS 요구사항 매핑 및 결과 분석
        isms_mapping = map_to_isms_requirements(results)
        compliance_summary = analyze_compliance(isms_mapping)
        
        return {
            'statusCode': 200,
            'body': {
                'scan_id': str(uuid.uuid4()),
                'timestamp': datetime.now().isoformat(),
                'account_id': account_id,
                'region': region,
                'results': results,
                'isms_mapping': isms_mapping,
                'compliance_summary': compliance_summary
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': {
                'error': str(e)
            }
        }
```

#### 3. 대시보드 컴포넌트 (Dashboard.js)

```javascript
// ISMS 준수 현황을 시각화하는 대시보드 컴포넌트
function ComplianceChart({ compliant, partial, nonCompliant }) {
  const theme = useTheme();
  
  const data = {
    labels: ['준수', '부분 준수', '미준수'],
    datasets: [{
      data: [compliant, partial, nonCompliant],
      backgroundColor: [
        theme.palette.success.main, 
        theme.palette.warning.main, 
        theme.palette.error.main
      ],
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
    }],
  };

  const totalItems = compliant + partial + nonCompliant;
  const compliancePercentage = totalItems > 0 
    ? Math.round((compliant / totalItems) * 100) 
    : 0;
  
  return (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          보안 준수 현황
        </Typography>
        
        <Box sx={{ position: 'relative', height: 280 }}>
          <Box sx={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {compliancePercentage}%
            </Typography>
            <Typography variant="caption">준수율</Typography>
          </Box>
          <Doughnut data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}
```

## 4. Q Developer 활용 포인트

### 4-1. 핵심 프롬프트 예시

#### 프롬프트 1: ISMS 체크리스트 자동 생성

```
@workspace
ISMS 인증 체크리스트를 자동으로 생성해주세요. 현재 프로젝트는 AWS 클라우드 환경에서 운영되는 웹 서비스입니다. 
다음 정보를 기반으로 체크리스트를 생성해주세요:
- 서비스 유형: SaaS 기반 웹 애플리케이션
- 주요 AWS 서비스: EC2, S3, RDS, Lambda, API Gateway
- 개인정보 처리 여부: 고객 이름, 이메일, 연락처 정보 저장
- 접근 제어: IAM, Cognito 사용
- 로깅: CloudTrail, CloudWatch 사용

각 체크리스트 항목에는 다음 정보를 포함해주세요:
1. ISMS 통제항목 번호 및 이름
2. 세부 점검 항목
3. AWS 서비스에서 설정 방법
4. 증적 자료 예시
```

#### 프롬프트 2: 보안 취약점 분석 및 해결 방안

```
@folder frontend/src/components
@folder backend/lambda

현재 AWS 환경에서 발견된 다음 보안 취약점에 대한 분석과 해결 방안을 제시해주세요:

1. S3 버킷 퍼블릭 액세스 설정 문제:
   - 버킷 이름: isms-reports-storage
   - 현재 상태: 퍼블릭 액세스 차단 비활성화

2. IAM 사용자 액세스 키 순환 미흡:
   - 사용자 수: 5명
   - 90일 이상 액세스 키 미변경: 3명

3. CloudTrail 로그 무결성 검증 비활성화:
   - 트레일 이름: management-events
   - 현재 상태: 로그 파일 무결성 검증 비활성화

각 취약점에 대해 다음 정보를 포함해주세요:
1. 위험 수준 (상/중/하)
2. 잠재적 영향
3. ISMS 통제항목 매핑
4. 해결을 위한 코드 또는 설정 변경 방안
5. 자동화 가능한 해결 방안
```

#### 프롬프트 3: ISMS 보고서 템플릿 생성

```
@folder docs

AWS 환경에서의 ISMS 인증을 위한 보고서 템플릿을 생성해주세요. 다음 섹션을 포함해야 합니다:

1. 경영진 요약
   - 전체 준수율
   - 주요 위험 영역
   - 개선 권고사항 요약

2. 보안 통제 현황
   - 관리적 보호조치
   - 기술적 보호조치
   - 물리적 보호조치

3. AWS 서비스별 보안 설정 현황
   - IAM
   - S3
   - EC2/VPC
   - 데이터베이스
   - 로깅 및 모니터링

4. 취약점 분석 및 조치 계획
   - 발견된 취약점 목록
   - 위험도 평가
   - 조치 계획 및 일정

5. 증적 자료 목록

각 섹션에는 표, 차트 등을 활용하여 시각적으로 정보를 표현할 수 있는 Markdown 형식의 템플릿을 제공해주세요.
```

## 5. 개발과정에서의 인사이트/주요 교훈/모범 사례

### 1. Amazon Q Developer를 활용한 효율적인 개발 프로세스

Amazon Q Developer를 활용하여 개발 시간을 크게 단축할 수 있었습니다. 특히 ISMS 관련 전문 지식이 필요한 부분에서 Amazon Q의 도움으로 정확한 정보와 코드를 빠르게 얻을 수 있었습니다. 개발자가 보안 전문가가 아니더라도 적절한 프롬프트를 통해 전문적인 보안 기능을 구현할 수 있었습니다.

### 2. 보안과 사용자 경험의 균형

ISMS 인증은 보안을 강화하는 과정이지만, 지나치게 복잡한 인터페이스는 사용자 경험을 저하시킬 수 있습니다. 프로젝트 개발 과정에서 보안 요구사항을 충족하면서도 직관적이고 사용하기 쉬운 인터페이스를 구현하는 것이 중요했습니다. Material UI를 활용한 모던한 디자인과 시각화 도구를 통해 복잡한 보안 정보를 이해하기 쉽게 전달할 수 있었습니다.

### 3. 자동화를 통한 지속적인 규정 준수

ISMS 인증은 일회성 이벤트가 아닌 지속적인 프로세스입니다. 프로젝트 개발 과정에서 자동화된 스캔 및 모니터링 시스템을 구축하여 규정 준수 상태를 지속적으로 확인하고 유지할 수 있는 방법을 구현했습니다. AWS Security Hub, Config 등의 서비스와 통합하여 실시간으로 보안 상태를 모니터링하고 위험 요소를 조기에 발견할 수 있는 시스템을 구축했습니다.

### 4. 확장 가능한 아키텍처 설계

프로젝트 초기에는 기본적인 ISMS 요구사항만 충족하는 것을 목표로 했지만, 향후 다양한 규제(GDPR, PCI DSS 등)로 확장할 수 있는 유연한 아키텍처를 설계했습니다. 모듈화된 코드 구조와 플러그인 방식의 검사 모듈을 통해 새로운 규제나 요구사항이 추가되어도 쉽게 확장할 수 있는 시스템을 구축했습니다.

### 5. Amazon Q Developer를 활용한 창의적인 문제 해결

개발 과정에서 예상치 못한 문제가 발생했을 때, Amazon Q Developer를 활용하여 창의적인 해결책을 찾을 수 있었습니다. 특히 AWS 서비스의 복잡한 설정이나 보안 정책 구현에 있어 Amazon Q의 제안은 매우 유용했습니다. 단순한 코드 작성 도구를 넘어 문제 해결 파트너로서 Amazon Q를 활용하는 방법을 배울 수 있었습니다.

## Amazon Q Developer 활용 방안 5가지

1. **코드 생성을 넘어선 아키텍처 설계**: Amazon Q에게 전체 시스템 아키텍처를 설계하도록 요청하고, 각 컴포넌트 간의 상호작용과 AWS 서비스 통합 방안을 제안받을 수 있습니다.

2. **도메인 특화 지식 활용**: ISMS와 같은 특정 도메인 지식이 필요한 경우, Amazon Q에게 관련 규제와 요구사항에 대한 설명과 이를 코드로 구현하는 방법을 함께 요청하면 더 효과적입니다.

3. **테스트 케이스 자동 생성**: 보안 관련 기능의 경우 다양한 시나리오에 대한 테스트가 중요합니다. Amazon Q에게 특정 보안 기능에 대한 테스트 케이스를 자동으로 생성하도록 요청할 수 있습니다.

4. **코드 리뷰 및 보안 취약점 분석**: 작성한 코드를 Amazon Q에게 리뷰하도록 요청하여 보안 취약점이나 개선 가능한 부분을 찾아낼 수 있습니다.

5. **문서화 자동화**: 복잡한 보안 설정이나 규정 준수 방법에 대한 문서를 Amazon Q를 통해 자동으로 생성하고, 이를 개발자 가이드나 사용자 매뉴얼로 활용할 수 있습니다.