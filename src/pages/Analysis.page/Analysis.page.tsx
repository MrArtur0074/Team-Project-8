import { NavLink, useParams } from "react-router-dom";
import style from "./Analysis.page.module.css";
import glob_style from "../Dashboard.page/Dashboard.page.module.css";
import { PieChart, BarChart } from "@mantine/charts";
import { Card, Text, Progress, Group, Badge } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { SurveyReport } from "../../components/general/SurveyReport/SurveyReport.comp";

interface Problem {
  вопрос: string;
  проблема: string;
}

interface SurveyData {
  статистика: {
    общее_количество_ответов: number;
    количество_положительных_ответов: number;
    количество_отрицательных_ответов: number;
    количество_неотвеченных_вопросов?: number;
    метки_основных_проблем?: string[];
  };
  проблемы?: Problem[];
  отчет:
    | {
        название: string;
        дата: string;
        полный_отчет: string;
      }
    | string;
}

export default function Analysis() {
  const { id } = useParams();
  const [surveyTitle, setSurveyTitle] = useState("");
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    axios
      .get(`http://16.171.3.5:8080/api/analytics/survey/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAnalyticsData(res.data);
        setSurveyTitle(res.data.title || "");
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setError("Нет доступа к аналитике этого опроса");
        } else {
          setError("Ошибка при получении аналитики");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className={style.analysis_loader_overlay}>
        <div className={style.analysis_loader_text}>
          Загрузка
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    );
  if (error || !analyticsData)
    return (
      <div className={glob_style.container}>
        {error || t("nopage.notfound")}
      </div>
    );

  const mockData: SurveyData = analyticsData || {
    статистика: {
      общее_количество_ответов: 0,
      количество_положительных_ответов: 0,
      количество_отрицательных_ответов: 0,
      количество_неотвеченных_вопросов: 0,
      метки_основных_проблем: [],
    },
    проблемы: [],
    отчет: { название: "", дата: "", полный_отчет: "" },
  };
  const stats = mockData.статистика || {};
  const report =
    typeof mockData.отчет === "object" && mockData.отчет !== null
      ? mockData.отчет
      : { название: "", дата: "", полный_отчет: "" };

  const pieChartData = [
    {
      name: "Позитивные",
      label: "Позитивные",
      value: stats["количество_положительных_ответов"] || 0,
      color: "#1675cd",
    },
    {
      name: "Негативные",
      label: "Негативные",
      value: stats["количество_отрицательных_ответов"] || 0,
      color: "#e03131",
    },
  ];

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const pieChartDataWithPercent = pieChartData.map((item) => ({
    ...item,
    label: `${item.name} (${total ? Math.round((item.value / total) * 100) : 0}%)`,
  }));

  const participationData = [
    {
      label: "Ответили",
      value: stats["общее_количество_ответов"] || 0,
      color: "gray",
    },
    {
      label: "Не ответили",
      value: 0, // если появится отдельное поле — подставьте его
      color: "#888",
    },
  ];

  const problemLabels = Array.isArray(
    (stats as Record<string, unknown>)["метки_основных_проблем"]
  )
    ? ((stats as Record<string, unknown>)["метки_основных_проблем"] as string[])
    : [];

  const surveyTitleToShow = String(
    report.название || surveyTitle || id || "report"
  );

  return (
    <div>
      <div className={glob_style.container}>
        <div className={style.container_analysis}>
          <div className={style.header_analysis}>
            <h1>{t("analysis.title")}</h1>
            <h3>
              {t("analysis.surveyTopic")} {surveyTitleToShow}
            </h3>
          </div>
          <div className={style.container_analysis_results}>
            <div className={style.analysis_block}>
              <h3>{t("analysis.generalAnalytics")}</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "3rem",
                  maxWidth: "1000px",
                }}
              >
                <div>
                  <h4>{t("analysis.answerRatio")}</h4>
                  <PieChart
                    withLabels
                    withLabelsLine
                    data={pieChartDataWithPercent}
                    style={{
                      width: 300,
                      height: 200,
                      margin: "0 auto",
                      background: "none",
                    }}
                  />
                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    {pieChartDataWithPercent.map((item) => (
                      <div
                        key={item.name}
                        style={{
                          color: item.color,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: item.color,
                            marginRight: 6,
                          }}
                        ></span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>{t("analysis.employeeParticipation")}</h4>
                  <BarChart
                    h={300}
                    data={participationData}
                    series={[{ name: "value", color: "#888" }]}
                    dataKey="label"
                    withLegend={false}
                    style={{ width: 350, margin: "0 auto" }}
                  />
                </div>
              </div>
            </div>

            <div className={style.analysis_block}>
              <h3>{t("analysis.problemQuestions")}</h3>
              {problemLabels.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {problemLabels.map((problem: string, index: number) => (
                    <Card
                      key={index}
                      shadow="sm"
                      padding="md"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: "#2b2b2b",
                        color: "white",
                        borderLeft: "5px solid #e03131",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#e03131",
                          fontSize: 16,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontWeight: 700,
                        }}
                      >
                        <span role="img" aria-label="problem">
                          ❗
                        </span>{" "}
                        {t("analysis.problem")} {problem}
                      </Text>
                    </Card>
                  ))}
                </div>
              ) : (
                <Text size="sm" c="dimmed">
                  {t("analysis.noProblems")}
                </Text>
              )}
            </div>

            <div className={style.analysis_block}>
              <h3>{t("analysis.aiInsights")}</h3>
              <div className={style.text_box}>
                {report.название && (
                  <span style={{ fontWeight: 600 }}>{report.название}</span>
                )}
                {/* {report.дата && (
                  <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>{report.дата}</div>
                )} */}
                {report["полный_отчет"] && (
                  <div style={{ marginTop: 8 }}>{report["полный_отчет"]}</div>
                )}
              </div>
            </div>
            <div className={style.btn_create_report}>
              <NavLink className={style.btn_back} to="/dashboard">
                {t("analysis.backToHome")}
              </NavLink>
              <PDFDownloadLink
                className={style.btn_report}
                document={
                  <SurveyReport
                    surveyTitle={surveyTitleToShow}
                    data={{
                      ...mockData,
                      отчет: report["полный_отчет"]
                        ? String(report["полный_отчет"])
                        : "",
                    }}
                  />
                }
                fileName={`${surveyTitleToShow}.pdf`}
                style={{}}
              >
                {({ loading }) =>
                  loading
                    ? t("analysis.generatingPdf")
                    : t("analysis.downloadPdf")
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
