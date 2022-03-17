import * as typescript from 'typescript';
declare const transformer: (_: typescript.Program) => (transformationContext: typescript.TransformationContext) => (sourceFile: typescript.SourceFile) => typescript.SourceFile;
export default transformer;
