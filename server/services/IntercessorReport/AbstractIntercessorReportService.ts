import type {
    IMondayService,
    ActivityLog,
    Item,
    User,
} from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import type { PrayerOrderData, PrayerOrderType  } from '~/../types/prayerOrder';

export abstract class AbstractIntercessorReportService {
    protected mondayService: IMondayService;
    protected boardIdProvider: IBoardIdProvider;

    protected prayerOrderType!: PrayerOrderType;

    protected boardIds!: number[];
    protected statusLabels?: Record<string, Record<number, string>>;
    protected allUsersMap?: Record<string, string>;

    constructor(
        mondayService: IMondayService,
        boardIdProvider: IBoardIdProvider
    ) {
        this.mondayService = mondayService;
        this.boardIdProvider = boardIdProvider;
    }

    protected async ensureReady(): Promise<void> {
        if (!this.boardIds) {
            this.boardIds = await this.boardIdProvider.getBoardIds(this.prayerOrderType);
        }
        if (!this.statusLabels || !this.allUsersMap) {
            this.statusLabels = await this.mondayService.getStatusLabels(
                this.boardIds
            );
            const allUsers = await this.mondayService.getAllMondayUsers();
            this.allUsersMap = allUsers.reduce(
                (map: Record<string, string>, user: User) => {
                    map[user.id] = user.name;
                    return map;
                },
                {}
            );
        }
    }

    protected makePrayerOrderList(
        closedChanges: ActivityLog[],
        items: Item[]
    ): PrayerOrderData[] {
        const prayerOrders: PrayerOrderData[] = [];
        for (const changeLog of closedChanges) {
            const unixMs = Math.round(parseInt(changeLog.created_at) / 10000);
            const changeLogData = JSON.parse(changeLog.data);
            let item = items.filter(
                (item: Item) => changeLogData.pulse_id == item.id
            )[0];
            let status = 'Unknown';
            if (item) {
                const statusColumnValue = item.column_values.find(
                    (cv) => cv.id === 'status'
                );
                if (statusColumnValue) {
                    try {
                        const parsedValue = JSON.parse(statusColumnValue.value);
                        const index = parsedValue?.index;
                        const boardId = item.board?.id;
                        status = boardId
                            ? this.statusLabels![boardId]?.[index] || 'Unknown'
                            : 'Unknown';
                    } catch {
                        status = 'Unknown';
                    }
                }
            } else {
                status = 'Deleted';
                item = {
                    id: 'none',
                    name: changeLogData.pulse_name,
                    column_values: [],
                    group: { id: 'none', title: 'Deleted' },
                };
            }
            prayerOrders.push({
                type: this.prayerOrderType,
                currentStatus: status,
                workedDate: new Date(unixMs),
                title: item.name,
                board: changeLog.boardName || 'Unknown',
                currentBoard: item.board?.name || 'Unknown',
                intercessor: this.allUsersMap![changeLog.user_id] || 'Unknown',
                currentGroup: item.group?.title || 'Unknown',
            });
        }
        return prayerOrders;
    }

    protected async loadMissingStatusLabels(items: Item[]): Promise<void> {
        const itemBoardIds = new Set<string>();
        for (const item of items) {
            if (item.board?.id) itemBoardIds.add(item.board.id);
        }
        const missingBoardIds: number[] = [];
        for (const id of itemBoardIds) {
            if (!this.statusLabels![id]) missingBoardIds.push(parseInt(id));
        }
        if (missingBoardIds.length > 0) {
            const fetched =
                await this.mondayService.getStatusLabels(missingBoardIds);
            this.statusLabels = { ...this.statusLabels, ...fetched };
        }
    }
}
