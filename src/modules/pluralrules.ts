import Compiler from 'make-plural-compiler/lib/compiler';
import { locale as createLocale } from '../utils';

function transformKeys<T>(
    object: Record<string, T>,
    transform: (v: string) => string,
): Record<string, T> {
    return Object.keys(object).reduce((result, key) => {
        result[transform(key)] = object[key];
        return result;
    }, {} as Record<string, T>);
}

export default function (
    locale: string,
    data: Record<string, unknown>,
): string {
    const transform = (k: string) => `pluralRule-count-${k}`;
    Compiler.rules = {
        cardinal: {
            [locale]: transformKeys(
                data.cardinal as Record<string, string>,
                transform,
            ),
        },
        ordinal: {
            [locale]: transformKeys(
                data.ordinal as Record<string, string>,
                transform,
            ),
        },
    };

    const compiler = new Compiler(locale, {
        cardinals: true,
        ordinals: true,
    });

    return createLocale({
        module: 'PluralRules',
        locale,
        data: {
            categories: compiler.categories,
            fn: compiler.compile(),
        },
        isJSON: false,
    });
}
