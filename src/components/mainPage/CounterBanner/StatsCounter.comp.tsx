import { useEffect, useState } from "react";
import style from "./StatsCounter.module.css";

// Интерфейс для пропсов компонента Counter
interface CounterProps {
  value: number;
  text: string;
}

export default function StatsCounter() {
  const stats = [
    { id: 1, value: 10, text: "Компании в Системе" },
    { id: 2, value: 30, text: "Хороших Отзывов" },
    { id: 3, value: 68, text: "Активных Юзеров" },
  ];

  return (
    <div className={style.container}>
      {stats.map((stat) => (
        <Counter key={stat.id} value={stat.value} text={stat.text} />
      ))}
    </div>
  );
}

// Указание типов пропсов для компонента Counter
function Counter({ value, text }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / value));
    const timer = setInterval(() => {
      start += 1;
      if (start >= value) {
        clearInterval(timer);
        start = value;
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={style.statBlock}>
      <h2 className={style.number}>
        {count.toLocaleString()}
        <span className={style.green}>+</span>
      </h2>
      <p className={`p_banner ${style.text}`}>{text}</p>
    </div>
  );
}
