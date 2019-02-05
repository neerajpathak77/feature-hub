import {
  FeatureServiceBinder,
  FeatureServiceProviderDefinition,
  SharedFeatureService
} from '@feature-hub/core';
import {ClientSideStateManager} from './internal/client-side-state-manager';
import {SerializedStateManager} from './internal/serialized-state-manager';
import {ServerSideStateManager} from './internal/server-side-state-manager';

export interface SerializedStateManagerV0 {
  /**
   * This method is intended to be called by consumers, i.e. Feature Apps and
   * Feature Services, on the server to register a callback that serializes
   * their state.
   *
   * @param serializeState A callback that returns the consumer state as a
   * serialized string.
   */
  register(serializeState: () => string): void;

  /**
   * This method is intended to be called by the integrator on the server when
   * the server-side rendering has been completed, to serialize all consumer
   * states. The returned string is encoded, so that it can be safely injected
   * into an HTML document. On the client, this string must be passed unmodified
   * into {@link setSerializedStates} where it will be decoded again.
   */
  serializeStates(): string;

  /**
   * This method is intended to be called by the integrator on the client to
   * provide the serialized state to all consumers, i.e. Feature Apps and
   * Feature Services, (via {@link getSerializedState}) that serialized their
   * state on the server.
   *
   * @param serializedStates The string that was created on the server with
   * {@link serializeStates}.
   */
  setSerializedStates(serializedStates: string): void;

  /**
   * This method is intended to be called by consumers, i.e. Feature Apps and
   * Feature Services, on the client to retrieve the serialized state that was
   * created on the server.
   */
  getSerializedState(): string | undefined;
}

export interface SharedSerializedStateManager extends SharedFeatureService {
  readonly '0.1.0': FeatureServiceBinder<SerializedStateManagerV0>;
}

/**
 * @see {@link SerializedStateManagerV0} for further information.
 */
export const serializedStateManagerDefinition: FeatureServiceProviderDefinition<
  SharedSerializedStateManager
> = {
  id: 's2:serialized-state-manager',

  create: () => {
    const serverSideStateManager = new ServerSideStateManager();
    const clientSideStateManager = new ClientSideStateManager();

    return {
      '0.1.0': consumerUid => ({
        featureService: new SerializedStateManager(
          consumerUid,
          serverSideStateManager,
          clientSideStateManager
        )
      })
    };
  }
};