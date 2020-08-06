import { basename, join } from 'path';
import { outputFile } from 'fs-extra';
import { program } from 'commander';

import { stepsGenerator, yamlFile } from './utils';
import * as modules from './modules';

/**
 * Options for program
 */
type Options = {
    /**
     * Function to infer `Intl` module name from filename.
     */
    getModule: (filename: string) => string;
    /**
     * Output directory
     */
    output: string;
    /**
     * Locale code
     */
    locale: string;
    /**
     * Files to process
     */
    files: string[];
};

async function main({ getModule, output, locale, files }: Options) {
    const steps = stepsGenerator(files.length);
    steps.next();
    const getOutputFile = (file: string) =>
        join(output, getModule(file) + '.js');

    for (const file of files) {
        const moduleName = getModule(file);
        await steps.next({
            title: moduleName,
            async fn() {
                if (moduleName in modules) {
                    const builder = modules[moduleName as keyof typeof modules];
                    const data = await yamlFile(file);
                    await outputFile(
                        getOutputFile(file),
                        builder(locale, data),
                    );
                } else {
                    throw new Error(`Unknown module ${moduleName}`);
                }
            },
        });
    }
}

program
    .version('0.1.0')
    .option(
        '-m <module>',
        'Module to create locale for. If specified, there should be only one input file',
    )
    .option('-d <dir>', 'Output dir', 'locale-data')
    .requiredOption('-l <locale>', 'Locale code')
    .arguments('<files...>')
    .description('Create locales for FormatJS')
    .action((files: string[]) => {
        if (program.m && files.length > 1) {
            console.error(
                'There should be only one file when -m option specified',
            );
            process.exit(1);
        }

        main({
            getModule: program.m
                ? () => program.m
                : (file) => basename(file, '.yml'),
            locale: program.l,
            output: program.d as string,
            files,
        });
    })
    .parse(process.argv);
