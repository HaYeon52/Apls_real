import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-40a2eee1/health", (c) => {
  return c.json({ status: "ok" });
});

// Save survey response
app.post("/make-server-40a2eee1/survey/submit", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log("=== 설문 응답 수신 ===");
    console.log("Body:", JSON.stringify(body, null, 2));
    
    // Generate unique ID for this survey response
    const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 저장할 데이터 구조 명확화
    const surveyData = {
      id: surveyId,
      이름: body.userData?.name || "",
      학번: body.userData?.studentId || "",
      출생년도: body.userData?.age || "",
      성별: body.userData?.gender || "",
      군복무여부: body.userData?.militaryStatus || "",
      학년: body.userData?.grade || "",
      학기: body.userData?.semester || "",
      진로방향: Array.isArray(body.userData?.careerPath) ? body.userData.careerPath.join(", ") : "",
      관심분야: Array.isArray(body.userData?.interestArea) ? body.userData.interestArea.join(", ") : "",
      수강과목: Array.isArray(body.userData?.completedCourses) ? body.userData.completedCourses.join(", ") : "",
      알게된경로: body.userData?.howDidYouKnow || "",
      알게된경로기타: body.userData?.howDidYouKnowOther || "",
      추천받은과목: Array.isArray(body.recommendations) ? body.recommendations.join(", ") : "",
      SWOT분석: body.swot || {},
      제출시간: new Date().toISOString(),
      원본데이터: body,
    };
    
    console.log("=== 저장할 데이터 ===");
    console.log(JSON.stringify(surveyData, null, 2));
    
    // Save survey data to KV store
    await kv.set(surveyId, surveyData);
    
    console.log(`✅ 설문 저장 완료: ${surveyId}`);
    console.log(`📊 Supabase 대시보드에서 확인: https://supabase.com/dashboard/project/kzsksntrwrzkgttowdov/database/tables`);
    
    return c.json({ 
      success: true, 
      surveyId,
      message: "설문이 성공적으로 저장되었습니다",
      savedData: surveyData
    });
  } catch (error) {
    console.error("❌ 설문 저장 중 오류:", error);
    console.error("Error details:", error.message);
    console.error("Stack:", error.stack);
    return c.json({ 
      success: false, 
      error: "설문 저장 중 오류가 발생했습니다",
      details: error.message 
    }, 500);
  }
});

// Get all survey responses
app.get("/make-server-40a2eee1/survey/responses", async (c) => {
  try {
    const surveys = await kv.getByPrefix("survey_");
    
    return c.json({ 
      success: true, 
      count: surveys.length,
      responses: surveys 
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return c.json({ 
      success: false, 
      error: "설문 데이터를 가져오는 중 오류가 발생했습니다",
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);