import type { SceneSpec } from '../../types/scene.ts'
import { kafkaTopics } from './kafka-topics.ts'
import { sparkApiStack } from './apache-spark-api-stack.ts'
import { sparkExecution } from './spark-execution.ts'

// The feed order. Add new scenes here.
export const scenes: SceneSpec[] = [kafkaTopics, sparkApiStack, sparkExecution]
