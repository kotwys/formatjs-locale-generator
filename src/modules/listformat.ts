import { locale as createLocale } from '../utils';

export default (locale: string, data: Record<string, unknown>): string =>
    createLocale({
        module: 'ListFormat',
        locale,
        data,
    });
