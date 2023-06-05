import React, { useEffect, useState } from 'react';

interface CountDownProps {
  count: number;
}
const CountDown: React.FC<CountDownProps> = (props: CountDownProps) => {
  const [count, setCount] = useState(props.count);
  useEffect(() => {
    setInterval(() => {
      console.log(123123, count);
      setCount(count - 1);
    }, 1000);
  }, []);
  return (
    <div className="flex items-center justify-center w-20 h-8 p-6 bg-gray-800 rounded-xl">
      <span>{count}seconds</span>
    </div>
  );
};
export default CountDown;
