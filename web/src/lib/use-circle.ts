"use client";

import useSWR from "swr";

import { getReadOnlyClient } from "@/lib/circle-client";
import { contractErrorMessage, describeError } from "@/lib/errors";

export interface MemberState {
  address: string;
  joined: boolean;
  depositedThisRound: boolean;
}

async function fetchCircle(circleId: bigint) {
  const client = getReadOnlyClient();
  const circleTx = await client.get_circle({ circle_id: circleId });
  const circleResult = circleTx.result;
  if (circleResult.isErr()) {
    throw new Error(contractErrorMessage(circleResult.unwrapErr().message));
  }
  const circle = circleResult.unwrap();

  const members = await Promise.all(
    circle.members.map(async (address): Promise<MemberState> => {
      const [joinedTx, depositedTx] = await Promise.all([
        client.has_joined({ circle_id: circleId, member: address }),
        client.has_deposited_current_round({ circle_id: circleId, member: address }),
      ]);
      const depositedResult = depositedTx.result;
      return {
        address,
        joined: joinedTx.result,
        depositedThisRound: depositedResult.isErr() ? false : depositedResult.unwrap(),
      };
    })
  );

  return { circle, members };
}

export function useCircle(circleId: bigint) {
  const { data, error, isLoading, mutate } = useSWR(
    ["circle", circleId.toString()],
    () => fetchCircle(circleId)
  );

  return {
    circle: data?.circle,
    members: data?.members,
    loading: isLoading,
    error: error ? describeError(error) : null,
    refetch: async () => {
      await mutate();
    },
  };
}
