
// record
exports.RECORD_TIME_KEY = "Time";
exports.RECORD_COUNTERS_KEY = "Counters";

// report config
exports.REPORT_CONFIG_PATH = "src/config/report_config.json";
exports.REPORT_SECTION_PATH_KEY = "section_config_path";

// section config
exports.SECTION_CONFIG_PATH = "src/config/section_config.json";
exports.SECTION_CONFIG_COUNTERS_PATH_KEY = "record_path";
exports.SECTION_CONFIG_CHART_TYPE = "chart_type";
exports.SECTION_CONFIG_COUNTER_FILTER = "counter_filter";
exports.SECTION_TABLE_PATH_LIST = "table_paths";

// server api
exports.SERVER_API_PRINT = "/api/print";
exports.SERVER_API_GET_SECTION_CONFIG_LIST = '/api/getSectionConfigList';
exports.SERVER_API_GET_COUNTER_DICT = '/api/getCounterDict';
exports.SERVER_API_GET_COUNTER_DICT_LIST = '/api/getCounterDictList';
exports.SERVER_API_GET_RECORD_TIME_LIST_LIST = '/api/getRecordTimeListList';
exports.SERVER_API_GET_RECORD_TIME_LIST = '/api/getRecordTimeList';
exports.SERVER_API_GET_CHART_COLOR = '/api/getChartColor';
exports.SERVER_API_GET_LINE_DATASET_TMPL = '/api/getLineDatasetTmpl';
exports.SERVER_API_GET_CHART_CONFIG = '/api/getChartConfig';
exports.SERVER_API_GET_STACK_LINE_OPTIONS = '/api/getStackLineOptions';
exports.SERVER_API_GET_REPORT_CONFIG_LIST = '/api/getReportConfigList';
exports.SERVER_API_GENERATE_DAILY_REPORT_CONFIG = '/api/generateDailyReportConfig';
exports.SERVER_API_GENERATE_DAILY_SECTION_CONFIG = '/api/generateDailySectionConfig';

// load config template
exports.REPORT_CONFIG_TMPL_PATH = 'src/config/report_config_tmpl.json';
exports.SECTION_CONFIG_TMPL_PATH = 'src/config/section_config_tmpl.json';


// ui
// section chart id suffix
exports.UI_SECTION_CHART_ID_SUFFIX = "chart";

// util
exports.UTIL_READ_FILE = "/api/readFile";

// display mode
exports.DISPLAY_MODE_DAILY = 'daily';

// io
exports.TMP_DIR = '.tmp';

// result directory structure
exports.SUB_DIRECTORY_LOG = 'log';
exports.SUB_DIRECTORY_CONFIG = 'config';
exports.SUB_DIRECTORY_SCENARIO = 'scenario';