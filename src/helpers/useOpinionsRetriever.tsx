import { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import properties from "../properties/properties";

interface AggregatedOpinion {
    type: string;
    count: number;
}

interface OpinionsDetail {
    date: Array<number>;
    aggregatedOpinions: Array<AggregatedOpinion>
}

interface ParsedOpinionsDetail {
    date: string;
    buyCount: number;
    sellCount: number;
    neutralCount: number;
}

const useOpinionsRetriever = (subredditProps: string, stockProps: string, dateRangeProps: string) => {

    const [subreddit, setSubreddit] = useState(subredditProps);
    const [stockSymbol, setStock] = useState(stockProps);
    const [dateRange, setDateRange] = useState(dateRangeProps);

    const [opinionsDetails, setOpinionsDetails] = useState<Array<ParsedOpinionsDetail>>([]);

    const [{ loading: requestLoading, data: requestData, error: error }, subredditOpinionsExecute] = useAxios(
        {
            url: `${properties.url.community}/api/subreddit/opinions`,
            params: { subreddit: subreddit, dateRange: dateRange, stockSymbol: stockSymbol },
            method: 'GET'
        },
        { manual: true }
    )

    const updateOpinions = (dateRange: string) => {
        setDateRange(dateRange);
    }

    useEffect(() => {
        if (stockSymbol && dateRange) {
            subredditOpinionsExecute();
        } else {
            console.log(`Unable to retrieve opinions, because one of variables is empty: { stockSymbol=${stockSymbol}, dateRange=${dateRange} }`);
        }
    }, [subreddit, stockSymbol, dateRange]);

    useEffect(() => {
        if (requestData) {
            const parsedOpinionsDetails = requestData.opinionsDetails.map(opinionsDetail => {

                return {
                    date: parseDate(opinionsDetail.date),
                    buyCount: getOpinionCount(opinionsDetail, "BUY"),
                    sellCount: getOpinionCount(opinionsDetail, "SELL"),
                    neutralCount: getOpinionCount(opinionsDetail, "NEUTRAL")
                };
            })
            setOpinionsDetails(parsedOpinionsDetails);
        }
    }, [requestData]);

    return { subreddit, stock: stockSymbol, dateRange, opinionsDetails, requestLoading, updateOpinions };
}

export default useOpinionsRetriever;

const getOpinionCount = (opinionsDetail: OpinionsDetail, type: string) => {
    return opinionsDetail.aggregatedOpinions
        .filter(detail => detail.type == type)
        .map(detail => detail.count)[0];
}

const parseDate = (dateArray: Array<number>) => {
    const date = new Date();

    date.setFullYear(dateArray[0]);
    date.setMonth(dateArray[1] - 1); // month starts with 0
    date.setDate(dateArray[2]);
    date.setHours(dateArray[3] - 2); // offsetting time for Lithuania local time, pls no judge
    date.setMinutes(dateArray[4]);
    date.setSeconds(dateArray[5]);
    date.setMilliseconds(dateArray[6]);

    return date.toString();
}