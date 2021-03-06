import {
    AfterViewInit, ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges, OnDestroy, SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    select,
    axisBottom,
    scaleLinear,
    axisLeft,
    line,
    Line,
    scaleTime,
    ScaleTime,
    ScaleLinear
} from 'd3';
import { IChartDataItem } from '../charts.models';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnChanges, AfterViewInit, OnDestroy {

    @Input()
    public chartData!: Array<IChartDataItem>;

    @Input()
    public color!: string;

    @ViewChild('chart')
    public chartRef!: ElementRef<HTMLElement>;

    public chartExist: boolean = false;

    public ngOnChanges(changes: SimpleChanges): void {
        const {chartData} = changes;

        if (!chartData || !this.chartRef) {
            return;
        }

        this.chartExist
            ? this.updateChart()
            : this.buildChart()
        ;
    }

    public ngAfterViewInit(): void {
        this.buildChart();

        window.addEventListener('resize', this.onResize);
    }

    public ngOnDestroy(): void {
        window.removeEventListener('resize', this.onResize);
    }

    public chartSize(): { margin: number, width: number, height: number } {
        const rect: DOMRect & { margin?: number } = this.chartRef.nativeElement.getBoundingClientRect();
        const margin = 70;

        return {
            margin,
            width: rect.width - margin * 2,
            height: rect.height - margin * 2
        };
    }

    private buildChart(): void {
        if (!this.chartData || !this.chartData.length) {
            return;
        }

        const {width, height, margin} = this.chartSize();
        const [xScale, yScale, lineBuilder, movingAverageLine] = this.getChartCalculations();

        const svg = select(this.chartRef.nativeElement).append('svg')
            .attr('width', width + margin * 2)
            .attr('height', height + margin * 2)
            .append('g')
            .attr('transform', `translate(${margin},${margin})`);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(axisBottom(xScale));

        svg.append('g')
            .attr('class', 'y axis')
            .call(axisLeft(yScale));

        const [simpleLine, movingLine] = ['line-origin', 'line-moving'].map((className: string) => svg
            .append('path')
            .attr('class', `line ${className}`)
            .style('fill', 'none')
            .style('stroke-width', 2)
            .style('stroke', this.color || '#ffab00')
        );

        simpleLine
            .style('stroke-opacity', '35%')
            .attr('d', lineBuilder(this.chartData));

        movingLine.attr('d', movingAverageLine(this.chartData));

        this.chartExist = true;
    }

    private updateChart(): void {
        if (!this.chartData || !this.chartData.length) {
            return;
        }

        const [xScale, yScale, lineBuilder, movingAverageLine] = this.getChartCalculations();

        select(this.chartRef.nativeElement)
            .select('.x.axis')
            .call(axisBottom(xScale));

        select(this.chartRef.nativeElement)
            .select('.y.axis')
            .call(axisLeft(yScale));

        select(this.chartRef.nativeElement)
            .select('.line.line-origin')
            .attr('d', lineBuilder(this.chartData));

        select(this.chartRef.nativeElement)
            .select('.line.line-moving')
            .attr('d', movingAverageLine(this.chartData));
    }

    private onResize: () => void = () => {
        this.updateChart();

        const { width, margin } = this.chartSize();

        select(this.chartRef.nativeElement)
            .select('svg')
            .attr('width', width + margin * 2)
        ;
    }

    private getChartCalculations(): [
        ScaleTime<number, number> | ScaleLinear<number, number>,
        ScaleLinear<number, number>,
        Line<IChartDataItem>,
        Line<IChartDataItem>
    ] {
        const {width, height} = this.chartSize();

        const xScale = typeof this.chartData[0].x === 'object'
            ? scaleTime()
                .domain([this.chartData[0].x, this.chartData[this.chartData.length - 1].x])
                .range([0, width])
            : scaleLinear()
                .domain([this.chartData[0].x, this.chartData[this.chartData.length - 1].x])
                .range([0, width])
        ;

        const yValues = this.chartData.map((item: IChartDataItem) => item.y);

        const yScale = scaleLinear()
            .domain([Math.min(...yValues), Math.max(...yValues)])
            .range([height, 0])
        ;

        const lineBuilder = line<IChartDataItem>()
            .x((d: IChartDataItem) => xScale(d.x))
            .y((d: IChartDataItem) => yScale(d.y))
        ;

        let prevPrevVal = 0;
        let prevVal = 0;
        let curVal = 0;

        const movingAverageLine = line<IChartDataItem>()
            .x((d: IChartDataItem) => xScale(d.x))
            .y((d: IChartDataItem, i: number) => {
                if (i === 0) {
                    prevPrevVal = yScale(d.y);
                    prevVal = yScale(d.y);
                    curVal = yScale(d.y);
                } else if (i === 1) {
                    prevPrevVal = prevVal;
                    prevVal = curVal;
                    curVal = (prevVal + yScale(d.y)) / 2;
                } else {
                    prevPrevVal = prevVal;
                    prevVal = curVal;
                    curVal = (prevPrevVal + prevVal + yScale(d.y)) / 3;
                }

                return curVal;
            })
        ;

        return [xScale, yScale, lineBuilder, movingAverageLine];
    }
}
