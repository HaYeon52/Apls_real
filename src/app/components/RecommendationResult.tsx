import { UserData } from "../App";
import { getRecommendations } from "../utils/recommendations";
import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { careerRoadmaps } from "../utils/courseRoadmaps";
import { allCourses } from "../utils/courseData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface RecommendationResultProps {
  userData: UserData;
  onReset: () => void;
  onCourseClick: (course: {
    name: string;
    category: string;
    credits: string;
    description: string;
  }) => void;
}

interface Course {
  name: string;
  description: string;
  category: string;
  credits: string;
  semester: string;
}

export function RecommendationResult({
  userData,
  onReset,
  onCourseClick,
}: RecommendationResultProps) {
  const recommendations = getRecommendations(userData);

  // 선수과목 확인 헬퍼 함수
  const checkPrerequisites = (courseName: string) => {
    const course = allCourses.find(c => c.name === courseName);
    if (!course || !course.prerequisites || course.prerequisites.length === 0) {
      return { hasMissingPrereqs: false, missingPrereqs: [] };
    }

    const missingPrereqs = course.prerequisites.filter(
      prereq => !userData.completedCourses.includes(prereq)
    );

    return {
      hasMissingPrereqs: missingPrereqs.length > 0,
      missingPrereqs,
    };
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="mb-3">{userData.name}님의 진로 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">학번</p>
            <p>{userData.studentId}</p>
          </div>
          <div>
            <p className="opacity-90">나이</p>
            <p>{userData.age}년생 ({2026 - parseInt(userData.age)}세)</p>
          </div>
          <div>
            <p className="opacity-90">성별</p>
            <p>
              {userData.gender}
              {userData.gender === '남성' && (
                <span className="ml-2">
                  ({userData.militaryCompleted ? '군필' : '미필'})
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="opacity-90">다음 학기</p>
            <p>
              {userData.grade} {userData.semester}
            </p>
          </div>
          <div className="col-span-2">
            <p className="opacity-90">진로 방향</p>
            <p>
              {userData.careerPath
                .map((path, idx) => `${idx + 1}. ${path}`)
                .join(", ")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="opacity-90">관심 분야</p>
            <p>
              {userData.interestArea
                .map((area, idx) => `${idx + 1}. ${area}`)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {/* 미이수 필수 과목 경고 */}
        {recommendations.missingRequiredCourses.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="text-red-900 mb-2">
                  아직 듣지 않은 필수 수업이 있어요!
                </h4>
                <p className="text-sm text-red-800 mb-3">
                  다음 필수 과목을 반드시 이수해야 졸업할 수 있습니다.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-2">
                    {recommendations.missingRequiredCourses.map(
                      (course, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-red-100 pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <span className="text-red-900 font-medium">
                              {course.name}
                            </span>
                            <span className="text-sm text-red-600 ml-2">
                              ({course.semester.replace('-', '학년 ')}학기)
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 이번 학기 추천 전공 수업 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h4 className="text-gray-900">
              {userData.grade} {userData.semester} 추천 전공 수업
            </h4>
          </div>

          {recommendations.currentSemesterCourses.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                이번 학기에 추천할 수 있는 과목이 없습니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                모든 과목을 이미 수강하셨거나, 개설된 과목이 없을 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.currentSemesterCourses.map(
                (course: any, index: number) => {
                  const isRequired = course.category === "전공기초(필수)";
                  const syllabus = getCourseSyllabus(course.name);
                  const tips = getCourseTips(course.name);
                  
                  // 선수과목 확인
                  const { hasMissingPrereqs, missingPrereqs } = checkPrerequisites(course.name);

                  // 로드맵 기반 - 어느 관심분야 로드맵에 속하는지 확인
                  const grade = userData.grade.replace('학년', '');
                  const semester = userData.semester.replace('학기', '');
                  const currentSemester = `${grade}-${semester}`;
                  const relevantInterests = userData.interestArea.filter((area) => {
                    const roadmap = careerRoadmaps[area];
                    if (!roadmap || !roadmap[currentSemester]) return false;
                    return roadmap[currentSemester].includes(course.name);
                  });

                  // 추천 근거 텍스트 생성
                  let reasonText = "";
                  if (isRequired) {
                    reasonText = "필수 과목입니다. 반드시 수강해야 합니다.";
                  } else if (relevantInterests.length > 0) {
                    const interestText = relevantInterests.join(", ");
                    const areaWord = relevantInterests.length === 1 ? "분야로" : "분야들로";
                    reasonText = `${userData.name}님의 관심분야 ${interestText} ${areaWord} 가기 위해서 들어야 하는 과목입니다.`;
                  } else {
                    reasonText = `산업공학 전공 역량을 키우기 위해 추천하는 과목입니다.`;
                  }

                  return (
                    <div key={index}>
                      <div
                        onClick={() => {
                          const courseDetails = allCourses.find(c => c.name === course.name);
                          onCourseClick({
                            name: course.name,
                            category: course.category,
                            credits: course.credits,
                            description: course.description,
                            prerequisites: courseDetails?.prerequisites,
                          });
                        }}
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all ${
                          hasMissingPrereqs 
                            ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 ring-2 ring-orange-200' 
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-gray-900 font-medium text-lg">
                                {course.name}
                              </span>
                              {hasMissingPrereqs && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold cursor-help flex items-center gap-1">
                                      ⚠️ 선수과목 미이수
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-orange-600 text-white border-orange-700">
                                    <div className="space-y-2">
                                      <p className="font-bold text-sm">⚠️ 경고</p>
                                      <p className="text-sm">
                                        다음 선수과목을 수강하지 않았습니다:
                                      </p>
                                      <ul className="text-xs list-disc list-inside space-y-1">
                                        {missingPrereqs.map((prereq, idx) => (
                                          <li key={idx}>{prereq}</li>
                                        ))}
                                      </ul>
                                      <p className="text-xs mt-2 pt-2 border-t border-orange-500">수강에 어려움이 있거나<br />개인적인 추가 학습이 필요할 수 있습니다.</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {isRequired && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">
                                  필수
                                </span>
                              )}
                              {!isRequired && course.score >= 0.8 && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-medium">
                                  강력 추천
                                </span>
                              )}
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                {course.category}
                              </span>
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                {course.credits}
                              </span>
                            </div>

                            {/* 추천 근거 */}
                            <div className="bg-white rounded-lg p-3 mb-2">
                              <p className="text-sm text-blue-900 font-medium mb-1">
                                💡 추천 근거
                              </p>
                              <p className="text-sm text-gray-700 whitespace-pre-line">
                                {course.recommendationReason || reasonText}
                              </p>
                            </div>

                            {/* 무엇을 배우는가 */}
                            {course.whatToLearn && (
                              <div className="bg-white rounded-lg p-3 mb-2">
                                <p className="text-sm text-green-900 font-medium mb-1">
                                  📖 무엇을 배우는가
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {course.whatToLearn}
                                </p>
                              </div>
                            )}
                            
                            {/* 교수님 코멘트 */}
                            {course.professorComment && (
                              <div className="bg-white rounded-lg p-3 mb-2">
                                <p className="text-sm text-blue-900 font-medium mb-1">
                                  👨‍🏫 교수님 말씀
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {course.professorComment}
                                </p>
                              </div>
                            )}
                            
                            {/* 선배 꿀팁 */}
                            {course.seniorTip && (
                              <div className="bg-white rounded-lg p-3 mb-2">
                                <p className="text-sm text-amber-900 font-medium mb-1">
                                  🎓 선배 꿀팁
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {course.seniorTip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            // TODO: 저장하기 기능
            alert('저장 기능은 준비 중입니다.');
          }}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          저장하기
        </button>
        <button
          onClick={() => {
            // TODO: 공유하기 기능
            alert('공유 기능은 준비 중입니다.');
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          공유하기
        </button>
      </div>
    </div>
    </TooltipProvider>
  );
}