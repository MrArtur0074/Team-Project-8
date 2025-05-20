import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import Montserrat from "../../../fonts/Montserrat-Medium.ttf";
// import Montserrat from "../../../fonts/Montserrat-Medium.ttf";

// import { Image } from "@mantine/core";
import Logo from "../../../assets/common/logo_main.svg";
import { useTranslation } from "react-i18next";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: `${Montserrat}`,
      fontWeight: 400,
    },
    {
      src: `${Montserrat}`,
      fontWeight: 600, // Добавлен для уверенных заголовков
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Montserrat",
    fontSize: 11,
    lineHeight: 1.4,
    backgroundColor: "#fff",
    color: "#232323",
  },
  logo: {
    width: 60,
    height: 60,
    margin: "0 auto",
    marginBottom: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 2,
    letterSpacing: 1.5,
    color: "#232323",
  },
  date: {
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    marginBottom: 18,
  },
  header: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 10,
    color: "#232323",
    letterSpacing: 1.2,
  },
  subheader: {
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 18,
    color: "#232323",
  },
  section: {
    marginBottom: 22,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    color: "#232323",
    letterSpacing: 0.5,
  },
  text: {
    marginBottom: 3,
    fontSize: 11,
    color: "#232323",
  },
  problemCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  problemTitle: {
    fontWeight: 600,
    color: "#c62828",
    marginBottom: 2,
    fontSize: 11,
  },
  reportText: {
    fontSize: 11,
    marginTop: 8,
    color: "#232323",
  },
  chartBox: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  chartLabel: {
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
  },
});

function getToday() {
  const d = new Date();
  return d.toLocaleDateString();
}

function PieChartSVG({
  positive,
  negative,
}: {
  positive: number;
  negative: number;
}) {
  const total = positive + negative;
  const posAngle = (positive / total) * 360;
  const negAngle = (negative / total) * 360;
  // Pie chart with two segments
  const posLargeArc = posAngle > 180 ? 1 : 0;
  const negLargeArc = negAngle > 180 ? 1 : 0;
  // Calculate end points
  const posX = 50 + 50 * Math.cos((2 * Math.PI * (posAngle - 90)) / 360);
  const posY = 50 + 50 * Math.sin((2 * Math.PI * (posAngle - 90)) / 360);
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Positive (blue) */}
      <path
        d={`M50,50 L50,0 A50,50 0 ${posLargeArc} 1 ${posX},${posY} Z`}
        fill="#1675cd"
      />
      {/* Negative (red) */}
      <path
        d={`M50,50 L${posX},${posY} A50,50 0 ${negLargeArc} 1 50,0 Z`}
        fill="#e03131"
      />
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="1"
      />
    </svg>
  );
}

interface Problem {
  вопрос: string;
  проблема: string;
}

interface SurveyData {
  статистика: {
    "общее количество ответов": number;
    "количество положительных ответов": number;
    "количество отрицательных ответов": number;
    "количество неотвеченных вопросов": number;
  };
  проблемы: Problem[];
  отчет: string;
}

interface SurveyReportProps {
  surveyTitle: string;
  data: SurveyData;
}

export function SurveyReport({ surveyTitle, data }: SurveyReportProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  const today = getToday();
  const pos = data?.статистика?.["количество положительных ответов"] ?? 0;
  const neg = data?.статистика?.["количество отрицательных ответов"] ?? 0;
  const totalResponses = data?.статистика?.["общее количество ответов"] ?? 0;
  const unanswered =
    data?.статистика?.["количество неотвеченных вопросов"] ?? 0;
  const problems = Array.isArray(data?.проблемы) ? data.проблемы : [];
  const reportText = data?.отчет ?? "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image src={Logo} style={styles.logo} />
          <Text style={styles.appName}>Anonimo</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <Text style={styles.header}>{t("surveyReport.title")}</Text>
        <Text style={styles.subheader}>
          {t("surveyReport.surveyTopic")} {surveyTitle}
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("surveyReport.generalAnalytics")}
          </Text>
          <Text style={styles.text}>
            {t("surveyReport.totalResponses")} {totalResponses}
          </Text>
          <Text style={styles.text}>
            {t("surveyReport.positiveResponses")} {pos}
          </Text>
          <Text style={styles.text}>
            {t("surveyReport.negativeResponses")} {neg}
          </Text>
          <Text style={styles.text}>
            {t("surveyReport.unansweredQuestions")} {unanswered}
          </Text>
          <View style={styles.chartBox}>
            <PieChartSVG positive={pos} negative={neg} />
            <Text style={styles.chartLabel}>
              {t("surveyReport.positiveResponses")} —
              <Text style={{ color: "#1675cd" }}>{pos}</Text> |{" "}
              {t("surveyReport.negativeResponses")} —
              <Text style={{ color: "#e03131" }}>{neg}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>
          {t("surveyReport.problemQuestions")}
        </Text>
        {problems.length > 0 ? (
          problems.map((item: Problem, index: number) => (
            <View key={index} style={styles.problemCard}>
              <Text style={styles.problemTitle}>
                {t("surveyReport.question")} {item.вопрос}
              </Text>
              <Text>
                {t("surveyReport.problem")} {item.проблема}
              </Text>
            </View>
          ))
        ) : (
          <Text>{t("surveyReport.noProblems")}</Text>
        )}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>
            {t("surveyReport.aiInsights")}
          </Text>
          <Text style={styles.reportText}>{reportText}</Text>
        </View>
      </Page>
    </Document>
  );
}
