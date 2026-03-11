import { LoaderCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import type { PricePoint } from '@/hooks/usePriceHistory';

interface MiniChartProps {
    data: PricePoint[];
    isPositive: boolean;
}

export const MiniChart = ({ data, isPositive }: MiniChartProps) => {
    const strokeColor = isPositive ? '#10b981' : '#f43f5e';

    if (data.length === 0) {
        return (
            <div className="h-20 flex items-center justify-center text-slate-500 text-sm">
                <LoaderCircle className="w-4 h-4 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-12 w-full md:h-15">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={strokeColor}
                        strokeWidth={2}
                        dot={false}
                        legendType='cross'
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
