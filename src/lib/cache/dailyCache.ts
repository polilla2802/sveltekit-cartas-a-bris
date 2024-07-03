// src/lib/cache.ts
export class DailyCache<T> {
	private cachedItem: T | null = null;
	private cacheDate: Date | null = null;

	getCachedItem(): T | null {
		if (this.isToday(this.cacheDate)) {
			return this.cachedItem;
		}
		return null;
	}

	setCachedItem(item: T) {
		this.cachedItem = item;
		this.cacheDate = new Date();
	}

	private isToday(date: Date | null): boolean {
		if (!date) return false;
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}
}

// Create an instance for storing the random frame of the day
export const randomFrameCache = new DailyCache<any>();
