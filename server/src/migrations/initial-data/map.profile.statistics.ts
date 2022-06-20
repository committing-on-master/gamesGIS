import {MapProfileStatisticsDao} from "../../data-layer/models/map.profile.statistics.dao";

const viewsStats = new MapProfileStatisticsDao();
viewsStats.viewsCount = 1;

export {viewsStats};
