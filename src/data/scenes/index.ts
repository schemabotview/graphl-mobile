import type { SceneSpec } from '../../types/scene.ts'
import { kafkaTopics } from './kafka-topics.ts'
import { sparkApiStack } from './apache-spark-api-stack.ts'
import { sparkRddApi } from './spark-rdd-api.ts'
import { sparkDataframeApi } from './spark-dataframe-api.ts'
import { sparkSqlApi } from './spark-sql-api.ts'
import { sparkPandasApi } from './spark-pandas-api.ts'
import { sparkReadingSources } from './spark-reading-sources.ts'
import { sparkWritingSinks } from './spark-writing-sinks.ts'
import { sparkCachePersist } from './spark-cache-persist.ts'
import { sparkPerformanceTuning } from './spark-performance-tuning.ts'
import { sparkStructuredStreaming } from './spark-structured-streaming.ts'
import { sparkExecution } from './spark-execution.ts'
import { sparkWindowing } from './spark-windowing.ts'
import { sparkWatermarking } from './spark-watermarking.ts'
import { scalaExecutionModel } from './scala-execution-model.ts'
import { scalaBindings } from './scala-bindings.ts'
import { scalaControlFlow } from './scala-control-flow.ts'
import { scalaOop } from './scala-oop.ts'
import { scalaEncapsulationPolymorphism } from './scala-encapsulation-polymorphism.ts'
import { scalaObjects } from './scala-objects.ts'
import { scalaFunctional } from './scala-functional.ts'
import { scalaCollections } from './scala-collections.ts'
import { scalaErrorHandling } from './scala-error-handling.ts'

// The feed order. Add new scenes here.
export const scenes: SceneSpec[] = [
  kafkaTopics,
  sparkExecution,
  sparkApiStack,
  sparkRddApi,
  sparkDataframeApi,
  sparkSqlApi,
  sparkPandasApi,
  sparkReadingSources,
  sparkWritingSinks,
  sparkCachePersist,
  sparkPerformanceTuning,
  sparkStructuredStreaming,
  sparkWindowing,
  sparkWatermarking,
  scalaExecutionModel,
  scalaBindings,
  scalaControlFlow,
  scalaOop,
  scalaEncapsulationPolymorphism,
  scalaObjects,
  scalaFunctional,
  scalaCollections,
  scalaErrorHandling,
]
