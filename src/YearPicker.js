import React, { Component } from "react";
import { LocaleProvider,Icon,message} from 'antd';
import './record.css';//这个文件自己选择一个温暖的地方放
import moment from 'moment';
import right from './img/right.png';
import lefts from './img/left.png';
class YearPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            selectedyear: "",
            years: [],
            selectedyears:'',
        };
    }

    componentWillMount() {
        this.setState({ selectedyear: moment().format('YYYY') },()=>{
           // console.log('defaultValue',defaultValue);
        });
    }
    componentDidMount() {
        let _this = this;
        document.addEventListener(
            "click",
            function(e) {
                const { isShow } = _this.state;
                let clsName = e.target.className;
                if (
                    clsName.indexOf("calendar") === -1 &&
                    e.target.tagName !== "BUTTON" &&
                    isShow
                ) {
                    _this.hide();
                }
            },
            false
        );
    }
    //初始化数据处理
    initData = (operand, defaultValue) => {
        console.log(operand,defaultValue);
        operand = operand ? operand : 12;
        let year = defaultValue - 1970;
        console.log(year);
        let curr = year % operand;
        console.log('curr',curr)
        let start = defaultValue - curr;

        let end = parseInt(defaultValue) + parseInt(operand) - 1 - curr;
        console.log('start',start);
        console.log('end',end);
        this.getYearsArr(start, end);
    };
    //   获取年份范围数组
    getYearsArr = (start, end) => {
        console.log('start1',start);
        console.log('end1',end);
        let arr = [];
        for (let i = start; i <= end; i++) {
            console.log('i',Number(i));
            arr.push(Number(i));
        }
        this.setState({
            years: arr
        },console.log('year',this.state.years));
    };
    // 显示日历年组件
    show = () => {
        const { selectedyear } = this.state;
        let { operand } = this.props;
        operand = operand ? operand : 12;
        this.initData(operand, selectedyear);
        this.setState({ isShow: true });
    };
    // 隐藏日期年组件
    hide = () => {
        this.setState({ isShow: false });
    };
    // 向前的年份
    prev = () => {
        const { years } = this.state;
        if (years[0] <= 1970) {
            return;
        }
        this.getNewYearRangestartAndEnd("prev");
    };
    // 向后的年份
    next = () => {
        this.getNewYearRangestartAndEnd("next");
    };

    //   获取新的年份
    getNewYearRangestartAndEnd = type => {
        const { selectedyear, years } = this.state;
        let operand = Number(this.props.operand);
        operand = operand ? operand : 12;
        let start = Number(years[0]);
        console.log('start',start);
        let end = Number(years[years.length - 1]);
        let newstart;
        let newend;
        if (type == "prev") {
            newstart = parseInt(start - operand);
            newend = parseInt(end - operand);
            this.setState({
                selectedyear:parseInt(selectedyear)-1,
            },()=>{
                this.getYearsArr(newstart, newend);
            })
        }
        if (type == "next") {

            newstart = parseInt(start + operand);
            newend = parseInt(end + operand);

            this.setState({
                selectedyear:parseInt(selectedyear)+1,
            },()=>{
                this.getYearsArr(newstart, newend);
            })
        }


    };

    // 选中某一年
    selects = e => {
        let val = Number(e.target.value);
        let current=Number(moment().format("YYYY"));
        if(val>current)
        {
            return;
        }else{
            this.hide();
            this.setState({ selectedyears: val,
                selectedyear: val,
            });
            if (this.props.callback) {
                this.props.callback(val);
           }
        }

    };

    render() {
        const { isShow, years, selectedyear, selectedyears} = this.state;

        return (
            <div className="calendar-wrap" style={{position:'relative'}}>
                <span className="ant-calendar-picker">
                <div>
                    <input
                        className="ant-calendar-picker-input ant-input"
                        placeholder={moment().format('YYYY')}
                        // onFocus={this.show}
                        onClick={this.show}
                        value={selectedyears}
                        //readOnly
                    />
                    {/*//<span  className="ant-calendar-picker-icon" ></span>*/}
                </div>
                </span>
                {isShow ? (
                    <List
                        data={years}
                        value={selectedyear}
                        prev={this.prev}
                        next={this.next}
                        cback={this.selects}
                    />
                ) : (
                    ""
                )}
            </div>
        );
    }
}
const List = props => {
    const { data, value, prev, next, cback } = props;
    return (
        <div className="ant-calendar1 ant-calendar-month" tabIndex="0">
          <div className="ant-calendar-month-panel" style={{position: 'relative'}}>
            <div>
            <div className="ant-calendar-month-panel-header">
                <a
                    type="double-left"
                    role="button"
                    className="ant-calendar-month-panel-prev-year-btn"
                    title="上一年"
                    onClick={prev}
                >
                </a>
                <span className="calendar-year-range">{value}</span>
                <a
                    type="double-right"
                    className="ant-calendar-month-panel-next-year-btn"
                    title="下一年"
                    role="button"
                    onClick={next}
                >
                </a>
            </div>
            <div className="ant-calendar-month-panel-body">
                <ul className="calendar-year-ul">
                    {data.map((item, index) => (
                        <li
                            key={index}
                            title={item}
                            //className="calendar-year-li calendar-year-selected"
                            // className={
                            //     item == value
                            //         ? "calendar-year-li calendar-year-selected"
                            //         : (item>Number(moment().format("YYYY"))? " calendar-year-li disabled":"calendar-year-li")
                            // }
                            className={
                                item == value
                                    ? "calendar-year-li calendar-year-selected"
                                    :(item>Number(moment().format("YYYY"))? " calendar-year-li disabled":"calendar-year-li")
                            }
                        >
                            <button onClick={cback} value={item}>
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
    );
};

export default YearPicker;