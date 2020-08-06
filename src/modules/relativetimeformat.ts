import { createLocale } from '../utils';

export default (locale: string, data: Record<string, unknown>): string =>
    createLocale({
        module: 'RelativeTimeFormat',
        locale,
        data,
    });
