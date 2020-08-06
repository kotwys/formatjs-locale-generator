type PluralsType = 'cardinal' | 'ordinal';

declare module 'make-plural-compiler/lib/compiler' {
    export default class Compiler {
        static rules: {
            [K in PluralsType]: Record<string, Record<string, string>>;
        };

        categories: Record<PluralsType, string[]>;

        constructor(
            locale: string,
            options: { cardinals: boolean; ordinals: boolean },
        );

        compile(): (n: number, ordinal: boolean) => string;
    }
}
