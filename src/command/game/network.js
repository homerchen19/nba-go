const getBroadcastNetworks = televisionNetworks => {
  let homeTeamNetwork = televisionNetworks.filter(
    broadcaster => broadcaster.home_visitor === 'home'
  );
  let visitorTeamNetwork = televisionNetworks.filter(
    broadcaster => broadcaster.home_visitor === 'visitor'
  );
  let nationalNetwork = televisionNetworks.filter(
    broadcaster => broadcaster.home_visitor === 'natl'
  );
  nationalNetwork = !nationalNetwork.length
    ? 'N/A'
    : nationalNetwork[0].display_name;
  homeTeamNetwork = !homeTeamNetwork.length
    ? nationalNetwork
    : homeTeamNetwork[0].display_name;
  visitorTeamNetwork = !visitorTeamNetwork.length
    ? nationalNetwork
    : visitorTeamNetwork[0].display_name;

  return {
    homeTeam: homeTeamNetwork,
    visitorTeam: visitorTeamNetwork,
  };
};

export default getBroadcastNetworks;
