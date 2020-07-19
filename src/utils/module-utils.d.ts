/**
 * Triggered when the updateCables value is updated, this hook will connect
 * an audio node if it finds a cable with the same id in the cables object.
 */
export const useCreateConnection: (id: string) => boolean;

// felt cute might delete later
/**
 * Determins if output is part of a cable object. If it is this hook returns
 * the color that is in the cable object. Triggered when updateCables value
 * is updated
 *
 */

export const useIsOutput: (id: string) => boolean;

/**
 * Determins if input is part of a cable object. If it is
 * this hook returns an object { [ inputName ] : color } containing the input
 * name with it value set to the color that belongs to the cable object. This
 * hook is triggered when the updateCables value is updated.
 */

export const useIsModulated: (id: string) => { [inputName: string]: string };

/**
 * This Hook returns the main output node for the rack
 */
export const useGetOut: () => node;

/**
 * This Hook returns a function that can be used to update the value of the
 * provided Audio parameter (input);
 */
export const useCheckDistance: () => setAudioParam;

declare type setAudioParam = (
  val: number,
  oldVal: number,
  input: AUDIO_PARAM,
  id: string,
  func: React.Dispatch<React.SetStateAction<number>>
) => void;
