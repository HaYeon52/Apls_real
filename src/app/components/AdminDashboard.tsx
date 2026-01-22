import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface SurveyResponse {
  id: string;
  이름: string;
  학번: string;
  출생년도: string;
  성별: string;
  군복무여부: string;
  학년: string;
  학기: string;
  진로방향: string;
  관심분야: string;
  수강과목: string;
  알게된경로: string;
  알게된경로기타: string;
  추천받은과목: string;
  SWOT분석: any;
  제출시간: string;
  원본데이터?: any;
}

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-40a2eee1/survey/responses`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        console.log("받아온 설문 데이터:", data);

        if (data.success) {
          setResponses(data.responses);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // 통계 계산
  const stats = {
    total: responses.length,
    byGender: responses.reduce((acc: any, r) => {
      acc[r.성별] = (acc[r.성별] || 0) + 1;
      return acc;
    }, {}),
    byGrade: responses.reduce((acc: any, r) => {
      acc[r.학년] = (acc[r.학년] || 0) + 1;
      return acc;
    }, {}),
    byCareerPath: responses.reduce((acc: any, r) => {
      if (r.진로방향) {
        r.진로방향.split(", ").forEach((path: string) => {
          if (path.trim()) {
            acc[path.trim()] = (acc[path.trim()] || 0) + 1;
          }
        });
      }
      return acc;
    }, {}),
    byInterestArea: responses.reduce((acc: any, r) => {
      if (r.관심분야) {
        r.관심분야.split(", ").forEach((area: string) => {
          if (area.trim()) {
            acc[area.trim()] = (acc[area.trim()] || 0) + 1;
          }
        });
      }
      return acc;
    }, {}),
    bySource: responses.reduce((acc: any, r) => {
      const source = r.알게된경로기타 
        ? `그외 (${r.알게된경로기타})`
        : r.알게된경로;
      if (source) {
        acc[source] = (acc[source] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
          >
            ← 돌아가기
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 ALPS 설문 통계 대시보드
          </h2>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">데이터를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              {/* 전체 응답 수 */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">전체 응답 수</h3>
                <p className="text-4xl font-bold">{stats.total}명</p>
              </div>

              {/* 성별 통계 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  성별 분포
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats.byGender).map(([gender, count]) => (
                    <div
                      key={gender}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <p className="text-gray-600 text-sm">{gender}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {count as number}명
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 학년 통계 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  학년별 분포
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats.byGrade).map(([grade, count]) => (
                    <div
                      key={grade}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <p className="text-gray-600 text-sm">{grade}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {count as number}명
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 진로 방향 통계 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  진로 방향 (중복 선택 가능)
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byCareerPath)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([path, count]) => (
                      <div
                        key={path}
                        className="bg-white rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-gray-700">{path}</span>
                        <span className="text-blue-600 font-semibold">
                          {count as number}명
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 관심 분야 통계 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  관심 분야 (중복 선택 가능)
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byInterestArea)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([area, count]) => (
                      <div
                        key={area}
                        className="bg-white rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-gray-700">{area}</span>
                        <span className="text-blue-600 font-semibold">
                          {count as number}명
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* ALPS 유입 경로 통계 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ALPS를 알게 된 경로
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.bySource)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([source, count]) => (
                      <div
                        key={source}
                        className="bg-white rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-gray-700">{source}</span>
                        <span className="text-blue-600 font-semibold">
                          {count as number}명
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 응답 목록 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  최근 응답 목록
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {responses
                    .slice()
                    .reverse()
                    .map((response, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {response.이름}
                            </p>
                            <p className="text-sm text-gray-600">
                              {response.학번} • {response.학년} {response.학기}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(response.제출시간).toLocaleString(
                              "ko-KR"
                            )}
                          </p>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>
                            진로: {response.진로방향}
                          </p>
                          <p>
                            관심분야: {response.관심분야}
                          </p>
                          <p className="text-blue-600 mt-2">
                            추천받은 과목 {response.추천받은과목.length}개
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}