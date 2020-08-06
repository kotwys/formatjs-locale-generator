import { readFile } from 'fs';
import * as path from 'path';
import * as serialize from 'serialize-javascript';
import { minify as uglify } from 'uglify-js';
import * as yaml from 'js-yaml';

/**
 * Step for steps function
 */
type Step = {
    title: string;
    fn: () => Promise<void>;
};

/**
 * Controls execution with steps.
 *
 * @param count - count of steps
 *
 * @returns a generator stopping to get step execution data.
 *
 * @example
 * const steps = stepsGenerator(4);
 * steps.next(); // start the generator
 * steps.next({
 *   title: 'Some step',
 *   async fn() {
 *     throw new Error('some error');
 *   }
 * });
 */
export async function* stepsGenerator(
    count: number,
): AsyncGenerator<void, void, Step> {
    for (let current = 0; current < count; current++) {
        const { title, fn } = yield;
        process.stdout.write(`[${current + 1}/${count}] ${title} `);
        try {
            await fn();
            process.stdout.write('Done.\n');
        } catch (error) {
            process.stdout.write('Error!\n');
            console.error(error);
            process.exit(2);
        }
    }
}

/**
 * Reads YAML file.
 */
export function yamlFile(filename: string): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        readFile(path.resolve(filename), { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err);
            resolve(yaml.safeLoad(data) as Record<string, unknown>);
        });
    });
}

type LocaleOptions = {
    /**
     * `Intl` module to create locale for
     */
    module: string;
    /**
     * Locale code
     */
    locale: string;
    /**
     * Locale data
     */
    data: Record<string, unknown>;
    /**
     * Whether the data is JSON-compatible or not.
     *
     * It's needed for optimization. Defaults to `true`
     */
    isJSON?: boolean;
};

/**
 * Utility method to create locale with specified data.
 */
export function locale(options: LocaleOptions): string {
    const minify = (code: string) => {
        const result = uglify(code, {
            output: {
                preamble: '/* @generated */',
            },
        });

        if (result.error) throw result.error;

        return result.code;
    };

    const { module, locale, data, isJSON } = { isJSON: true, ...options };
    const serializedData = serialize(data, { isJSON });

    return minify(`
        Intl.${module}
            && typeof Intl.${module}.__addLocaleData === 'function'
            && Intl.${module}.__addLocaleData({
                data: { ${locale}: ${serializedData} },
                availableLocales: ["${locale}"],
                aliases: {},
                parentLocales: {}
            });
    `);
}
